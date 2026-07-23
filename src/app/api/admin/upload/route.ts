import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Uploads an image into the site (public/uploads/<file>) by committing it to
 * GitHub, which triggers Railway's auto-deploy. Returns the public path to
 * store on the item. Protected by ADMIN_KEY. Requires GITHUB_TOKEN.
 */
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "Shahul16/girsd-website";
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!adminKey || !token) {
    return NextResponse.json(
      { error: "Image upload needs ADMIN_KEY and GITHUB_TOKEN set in Railway. You can still paste an image path meanwhile." },
      { status: 503 }
    );
  }

  const form = await req.formData();
  if (String(form.get("adminKey")) !== adminKey) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }
  const file = form.get("file") as File | null;
  if (!file || file.size === 0) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image too large (8 MB max)" }, { status: 413 });
  if (!/^image\//.test(file.type)) return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = (file.name.replace(/\.[^.]+$/, "") || "image").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const filename = `uploads/${base}-${Date.now()}.${ext}`;
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");

  const api = `https://api.github.com/repos/${repo}/contents/public/${filename}`;
  const res = await fetch(api, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "girsd-admin" },
    body: JSON.stringify({ message: `Admin image upload: ${filename}`, content, branch }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: `Upload failed (${res.status})`, detail }, { status: 502 });
  }
  return NextResponse.json({ ok: true, path: `/${filename}` });
}
