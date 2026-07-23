import "server-only";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * Bypasses RLS — never import from client components.
 * Env (Railway → Variables): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Verifies a bearer JWT from the request and returns the Supabase user. */
export async function getUserFromRequest(req: Request): Promise<User | null> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const admin = getAdminClient();
  if (!admin) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/** True when the user holds an active (paid, uncancelled, <1yr old) membership. */
export async function hasActiveMembership(userId: string): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return false;
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const { data, error } = await admin
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "membership")
    .is("cancelled_at", null)
    .gte("created_at", yearAgo.toISOString())
    .limit(1);
  return !error && Boolean(data && data.length > 0);
}
