"use client";

import { useState, type FormEvent, type ReactNode } from "react";

/** Generic client-side form wrapper: shows a success message after submit (demo — no backend). */
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
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800" role="status">
        <p className="font-display text-lg font-bold">Thank you</p>
        <p className="mt-1 text-sm leading-relaxed">{successMessage}</p>
        <button onClick={() => setSent(false)} className="mt-4 text-sm font-semibold underline">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label={name} className="space-y-5">
      {children}
      <button type="submit" className="btn-gold">
        {submitLabel}
      </button>
      <p className="text-xs text-slate-500">
        By submitting this form you agree to our{" "}
        <a href="/legal/privacy" className="underline">Privacy Policy</a>. Demo site: submissions are not transmitted.
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
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: string[];
  rows?: number;
  autoComplete?: string;
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
      ) : (
        <input id={id} name={id} type={type} required={required} className="input" autoComplete={autoComplete} />
      )}
    </div>
  );
}
