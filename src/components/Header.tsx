"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/courses", label: "Courses" },
  { href: "/awards", label: "Awards" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Utility bar */}
      <div className="bg-navy-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-sm">
          <Link
            href="/events"
            className="rounded bg-gold px-3 py-1 font-semibold text-navy transition hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book Tickets / Join Now
          </Link>
          <nav aria-label="Account" className="flex items-center gap-4">
            {ready && user ? (
              <>
                <Link href="/dashboard" className="hover:text-gold-light">
                  My Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-gold-light"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gold-light">
                  Login
                </Link>
                <Link href="/register" className="hover:text-gold-light">
                  Register
                </Link>
                <Link href="/dashboard" className="hidden sm:inline hover:text-gold-light">
                  My Dashboard
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="GIRSD home">
            <Image src="/logo.svg" alt="" width={42} height={50} priority unoptimized />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide text-white">
                GIRSD
              </span>
              <span className="hidden text-[11px] text-slate-300 sm:block">
                Global Institute of Research &amp; Skills Development
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`nav-underline rounded px-3 py-2 text-sm font-medium transition hover:text-gold-light ${
                        active ? "text-gold" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            className="rounded p-2 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-navy-light lg:hidden">
            <ul className="mx-auto max-w-7xl px-4 py-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded px-3 py-2.5 font-medium hover:bg-navy-light hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
