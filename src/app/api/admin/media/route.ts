import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".ico"];

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const supplied = req.nextUrl.searchParams.get("key") || "";

  if (adminKey && supplied !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    const files: Array<{ name: string; path: string; size: number; mtime: number }> = [];

    // Scan uploads directory
    try {
      const uploadEntries = await fs.readdir(uploadsDir, { withFileTypes: true });
      for (const entry of uploadEntries) {
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            const stat = await fs.stat(path.join(uploadsDir, entry.name));
            files.push({
              name: entry.name,
              path: `/uploads/${entry.name}`,
              size: stat.size,
              mtime: stat.mtimeMs,
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not read uploads dir:", e);
    }

    // Scan public root for standard site images and logos
    try {
      const rootEntries = await fs.readdir(publicDir, { withFileTypes: true });
      for (const entry of rootEntries) {
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            const stat = await fs.stat(path.join(publicDir, entry.name));
            files.push({
              name: entry.name,
              path: `/${entry.name}`,
              size: stat.size,
              mtime: stat.mtimeMs,
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not read public dir:", e);
    }

    // Sort newest first
    files.sort((a, b) => b.mtime - a.mtime);

    return NextResponse.json({ ok: true, media: files });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to scan media: " + err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const body = await req.json().catch(() => null);

  if (adminKey && body?.adminKey !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filePath = String(body?.path || "").trim();
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Can only delete files in /uploads/" }, { status: 400 });
  }

  try {
    const fullPath = path.join(process.cwd(), "public", filePath.slice(1));
    await fs.unlink(fullPath);
    return NextResponse.json({ ok: true, message: "File deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete file: " + err.message }, { status: 500 });
  }
}
