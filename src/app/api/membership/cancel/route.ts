import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, getUserFromRequest } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";

/** Marks the signed-in user's active membership order as cancelled. */
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const { error } = await admin
    .from("orders")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("kind", "membership")
    .is("cancelled_at", null);

  if (error) {
    console.error("Cancel membership failed:", error);
    return NextResponse.json({ error: "Could not cancel membership." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
