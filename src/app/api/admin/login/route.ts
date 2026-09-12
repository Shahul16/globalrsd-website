import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Verifies the admin password against ADMIN_KEY (set in Railway → Variables).
 * 200 ok · 401 wrong · 503 not configured (allows local preview).
 */
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const body = await req.json().catch(() => null);
  const supplied = String(body?.key ?? "");

  if (!adminKey) {
    return NextResponse.json(
      { error: "Admin access is not configured yet (ADMIN_KEY is not set).", configured: false },
      { status: 503 }
    );
  }
  if (supplied && supplied === adminKey) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
}
