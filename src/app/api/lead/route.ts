import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const MAX_ATTACHMENT = 10 * 1024 * 1024; // 10 MB

/**
 * Receives every enquiry form (Contact, Membership, Partner, Awards) as
 * multipart/form-data and emails it to the admin via Resend.
 *
 * Env (Railway → Variables):
 *   RESEND_API_KEY   – required
 *   LEAD_TO_EMAIL    – optional, defaults to SITE.email (info@globalrsd.co.uk)
 *   LEAD_FROM_EMAIL  – optional, defaults to Resend's onboarding sender.
 *                      After verifying globalrsd.co.uk in Resend, set e.g.
 *                      "GIRSD Website <leads@globalrsd.co.uk>"
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The enquiry service is not configured yet (RESEND_API_KEY missing). Please email us directly at " + SITE.email },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot — real visitors never fill this hidden field.
  if (String(form.get("website") ?? "")) {
    return NextResponse.json({ ok: true }); // silently drop bots
  }

  const formName = String(form.get("_form") ?? "Website enquiry").slice(0, 80);
  const fields: [string, string][] = [];
  const attachments: { filename: string; content: Buffer }[] = [];
  let visitorEmail = "";
  let visitorName = "";

  for (const [key, value] of form.entries()) {
    if (key === "_form" || key === "website") continue;
    if (value instanceof File) {
      if (value.size === 0) continue;
      if (value.size > MAX_ATTACHMENT) {
        return NextResponse.json({ error: "Attachment is too large (10 MB max)." }, { status: 413 });
      }
      attachments.push({
        filename: value.name || "attachment",
        content: Buffer.from(await value.arrayBuffer()),
      });
      continue;
    }
    const text = String(value).slice(0, 5000);
    if (!text) continue;
    if (key.toLowerCase() === "email") visitorEmail = text;
    if (key.toLowerCase() === "name") visitorName = text;
    fields.push([label(key), text]);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "The form is empty." }, { status: 400 });
  }

  const to = process.env.LEAD_TO_EMAIL || SITE.email;
  const from = process.env.LEAD_FROM_EMAIL || "GIRSD Website <onboarding@resend.dev>";
  const subject = `[${formName}] ${visitorName || visitorEmail || "New submission"}`;

  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>` +
        `<td style="padding:8px 12px;border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  const html =
    `<div style="font-family:Arial,sans-serif;color:#14213D">` +
    `<h2 style="margin:0 0 4px">${escapeHtml(formName)}</h2>` +
    `<p style="margin:0 0 16px;color:#64748b;font-size:13px">Submitted via ${SITE.domainDisplay} on ${new Date().toUTCString()}</p>` +
    `<table style="border-collapse:collapse;font-size:14px">${rows}</table>` +
    (attachments.length ? `<p style="font-size:13px;color:#64748b">${attachments.length} attachment(s) included.</p>` : "") +
    `</div>`;
  const text = fields.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
      replyTo: visitorEmail || undefined,
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "We could not send your enquiry just now. Please email us at " + SITE.email },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Lead send failed:", err);
    return NextResponse.json(
      { error: "We could not send your enquiry just now. Please email us at " + SITE.email },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function label(key: string): string {
  return key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
