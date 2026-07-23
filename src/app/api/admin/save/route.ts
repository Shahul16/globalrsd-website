import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COLLECTIONS: Record<string, string[]> = {
  events: ["slug", "category", "title", "acronym", "date", "city", "summary", "tickets"],
  courses: ["slug", "title", "level", "duration", "price", "category", "summary"],
  awards: ["id", "type", "name", "track", "description"],
  news: ["slug", "title", "date", "author", "excerpt", "body"],
};

/**
 * Commits a content collection to GitHub (src/content/<collection>.json),
 * which triggers Railway's auto-deploy. Protected by ADMIN_KEY.
 */
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "Shahul16/girsd-website";
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!adminKey || !token) {
    return NextResponse.json(
      { error: "Publishing is not configured (ADMIN_KEY / GITHUB_TOKEN missing). Changes preview locally but can't go live yet." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || body.adminKey !== adminKey) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }

  const required = COLLECTIONS[body.collection];
  if (!required) return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  if (!Array.isArray(body.data) || body.data.length === 0) {
    return NextResponse.json({ error: "Data must be a non-empty list" }, { status: 400 });
  }
  for (const [i, item] of body.data.entries()) {
    for (const key of required) {
      if (item[key] === undefined || item[key] === "") {
        return NextResponse.json({ error: `Item ${i + 1}: required field "${key}" is missing or empty` }, { status: 400 });
      }
    }
  }
  const idKey = body.collection === "awards" ? "id" : "slug";
  const ids = body.data.map((d: Record<string, string>) => d[idKey]);
  if (new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: `Duplicate ${idKey}s — every item needs a unique ${idKey}` }, { status: 400 });
  }

  const path = `src/content/${body.collection}.json`;
  const api = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "girsd-admin" };

  const current = await fetch(`${api}?ref=${branch}`, { headers });
  if (!current.ok) return NextResponse.json({ error: `GitHub read failed (${current.status})` }, { status: 502 });
  const { sha } = await current.json();

  const content = Buffer.from(JSON.stringify(body.data, null, 2) + "\n").toString("base64");
  const commit = await fetch(api, {
    method: "PUT",
    headers,
    body: JSON.stringify({ message: `Admin update: ${body.collection}`, content, sha, branch }),
  });
  if (!commit.ok) {
    const detail = await commit.text();
    return NextResponse.json({ error: `GitHub commit failed (${commit.status})`, detail }, { status: 502 });
  }
  return NextResponse.json({ ok: true, message: "Published. Railway is redeploying — changes go live in about 2 minutes." });
}
