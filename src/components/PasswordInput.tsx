"use client";

import { useState } from "react";

/**
 * Password field with a show/hide (eye) toggle.
 * Drop-in replacement for <input type="password">.
 */
export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required = true,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="input pr-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-navy focus:outline-none focus-visible:text-navy"
      >
        {visible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58a2 2 0 002.83 2.83" />
            <path d="M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a17.6 17.6 0 01-3.87 4.9M6.6 6.6C4.5 8 3 9.9 2 12c1 4 5 8 10 8 1.52 0 2.95-.35 4.24-.94" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
