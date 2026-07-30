import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/** Returns a paid Checkout Session's summary for the confirmation page. */
export async function GET(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Payments not configured." }, { status: 503 });

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing session." }, { status: 400 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      title: session.metadata?.title ?? "Your order",
      quantity: Number(session.metadata?.quantity) || 1,
      total: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "gbp").toUpperCase(),
      reference: sessionId.slice(-10).toUpperCase(),
      email: session.customer_details?.email ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
