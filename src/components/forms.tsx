"use client";

import { useState, type FormEvent, type ReactNode } from "react";

/**
 * Enquiry form wrapper. Submits all fields (including file attachments) to
 * /api/lead, which emails them to the admin inbox via Resend.
 */
export function DemoForm({
  children,
  submitLabel,
  successMessage,
  name,
}: {
  children: ReactNode;
  submitLabel: string;
  successMessage: string;
  name: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError("");
    setStatus("sending");

    const data = new FormData(formEl);
    data.set("_form", name);

    try {
      const res = await fetch("/api/lead", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Something went wrong — please try again or email us directly.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
      formEl.reset();
    } catch {
      setError("Network problem — please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800" role="status">
        <p className="font-display text-lg font-bold">Thank you</p>
        <p className="mt-1 text-sm leading-relaxed">{successMessage}</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold underline">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label={name} className="space-y-5">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {children}
      {/* Honeypot — hidden from humans, catches spam bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${name}-website`}>Website</label>
        <input id={`${name}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-gold disabled:opacity-60">
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
      <p className="text-xs text-slate-500">
        By submitting this form you agree to our{" "}
        <a href="/legal/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}

export function Field({
  label,
  id,
  type = "text",
  required = true,
  as = "input",
  options,
  rows = 5,
  autoComplete,
  accept,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea" | "select" | "file";
  options?: string[];
  rows?: number;
  autoComplete?: string;
  accept?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true" className="text-red-600"> *</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={id} name={id} required={required} rows={rows} className="input" />
      ) : as === "select" ? (
        <select id={id} name={id} required={required} className="input" defaultValue="">
          <option value="" disabled>
            Please select…
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : as === "file" ? (
        <input
          id={id}
          name={id}
          type="file"
          required={required}
          accept={accept}
          className="block w-full rounded-md border border-line text-sm text-muted file:mr-3 file:rounded-l-md file:border-0 file:bg-navy file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-light"
        />
      ) : (
        <input id={id} name={id} type={type} required={required} className="input" autoComplete={autoComplete} />
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
