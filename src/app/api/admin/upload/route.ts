import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

/**
 * Uploads an image into public/uploads/<filename> (or a specified target like /logo-header.png).
 * In local development, saves directly to the public folder so it can be previewed immediately.
 * In production (with GITHUB_TOKEN & GITHUB_REPO), commits to GitHub to trigger live redeployment.
 */
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  const form = await req.formData();
  const suppliedKey = String(form.get("adminKey") || "");

  if (adminKey && suppliedKey !== adminKey) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  const file = form.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (15 MB max)" }, { status: 413 });
  }
  if (!/^image\//.test(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|ico)$/i)) {
    return NextResponse.json({ error: "Only image files (JPG, PNG, WebP, SVG, ICO) are allowed" }, { status: 415 });
  }

  const customFilename = String(form.get("filename") || "").trim();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = (file.name.replace(/\.[^.]+$/, "") || "image")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  let targetRelative = `uploads/${base}-${Date.now()}.${ext}`;
  if (customFilename === "logo-header") targetRelative = "logo-header.png";
  else if (customFilename === "logo-white") targetRelative = "logo-white.png";
  else if (customFilename === "favicon") targetRelative = "favicon.ico";

  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. Write to local disk if running locally
  let localSaved = false;
  try {
    const publicDir = path.join(process.cwd(), "public");
    const targetDir = path.dirname(path.join(publicDir, targetRelative));
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(publicDir, targetRelative), buffer);
    localSaved = true;
  } catch (err) {
    console.warn("Could not save image to local disk:", err);
  }

  // 2. Commit to GitHub if credentials exist
  if (token && repo) {
    const api = `https://api.github.com/repos/${repo}/contents/public/${targetRelative}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "girsd-admin",
    };

    try {
      // Check if file already exists to get SHA for updates
      let sha: string | undefined;
      const existing = await fetch(`${api}?ref=${branch}`, { headers });
      if (existing.ok) {
        const d = await existing.json();
        sha = d.sha;
      }

      const res = await fetch(api, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Admin image upload: ${targetRelative}`,
          content: buffer.toString("base64"),
          sha,
          branch,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        return NextResponse.json(
          { error: `GitHub image commit failed (${res.status})`, detail, path: `/${targetRelative}`, localSaved },
          { status: 502 }
        );
      }

      return NextResponse.json({
        ok: true,
        path: `/${targetRelative}`,
        message: "Image uploaded and committed to GitHub.",
        localSaved: true,
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error committing image: " + (err.message || String(err)), path: `/${targetRelative}`, localSaved },
        { status: 502 }
      );
    }
  }

  if (localSaved) {
    return NextResponse.json({
      ok: true,
      path: `/${targetRelative}`,
      message: "Image saved locally.",
      localSaved: true,
    });
  }

  return NextResponse.json(
    { error: "Upload is not configured. Missing GITHUB_TOKEN or GITHUB_REPO." },
    { status: 503 }
  );
}
