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
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!adminKey || !token || !repo) {
    const missing = [!adminKey && "ADMIN_KEY", !token && "GITHUB_TOKEN", !repo && "GITHUB_REPO"].filter(Boolean).join(", ");
    return NextResponse.json(
      { error: `Publishing is not configured. Missing Railway variable(s): ${missing}. Changes preview locally but can't go live until these are set — see SETUP_GUIDE.md.` },
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

  // Events have nested structures (tickets/agenda/speakers) that are edited
  // as raw JSON in the admin's "Advanced" box. A missing sub-field there
  // (e.g. a ticket with no `includes` array) doesn't fail this validation
  // above, but it DOES crash the Next.js static build for every page, not
  // just this one — taking the whole live site down until someone finds
  // and fixes the JSON by hand. This once broke production this exact way.
  // So for events specifically: normalise the optional arrays admins are
  // most likely to omit, and reject clearly wrong dates up front instead of
  // silently guessing.
  if (body.collection === "events") {
    for (const [i, ev] of body.data.entries()) {
      const label = ev.acronym || ev.slug || `Item ${i + 1}`;
      if (!Array.isArray(ev.tickets) || ev.tickets.length === 0) {
        return NextResponse.json({ error: `${label}: needs at least one ticket in "tickets"` }, { status: 400 });
      }
      for (const [ti, t] of ev.tickets.entries()) {
        if (!t.id || !t.name || typeof t.price !== "number") {
          return NextResponse.json({ error: `${label}: ticket ${ti + 1} needs id, name and a numeric price` }, { status: 400 });
        }
        if (!Array.isArray(t.includes)) t.includes = [];
      }
      if (!Array.isArray(ev.themes)) ev.themes = [];
      if (!Array.isArray(ev.speakers)) ev.speakers = [];
      if (!Array.isArray(ev.agenda)) ev.agenda = [];
      for (const day of ev.agenda) {
        if (!Array.isArray(day.items)) day.items = [];
      }
      if (ev.endDate) {
        const start = new Date(ev.date);
        const end = new Date(ev.endDate);
        if (!isNaN(+start) && !isNaN(+end) && end < start) {
          return NextResponse.json(
            { error: `${label}: End date (${ev.endDate}) is before the start date (${ev.date}) — check the dates.` },
            { status: 400 }
          );
        }
      }
    }
  }

  const path = `src/content/${body.collection}.json`;
  const api = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "girsd-admin" };

  const current = await fetch(`${api}?ref=${branch}`, { headers });
  if (!current.ok) {
    const detail = await current.text();
    const hint =
      current.status === 404
        ? `Not found — check GITHUB_REPO ("${repo}") matches your real repo exactly (owner/name) and that ${path} exists on branch "${branch}".`
        : current.status === 401
        ? "Bad credentials — check GITHUB_TOKEN is valid and hasn't expired."
        : current.status === 403
        ? "Forbidden — the token may lack repo contents permission, or you've hit a rate limit."
        : undefined;
    return NextResponse.json({ error: `GitHub read failed (${current.status})`, detail, hint }, { status: 502 });
  }
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
