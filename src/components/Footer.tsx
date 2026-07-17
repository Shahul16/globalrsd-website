import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const columns = [
  {
    heading: "Institute",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/news", label: "News" },
      { href: "/partner", label: "Partner With Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Programmes",
    links: [
      { href: "/events", label: "Events & Conferences" },
      { href: "/courses", label: "Online Courses" },
      { href: "/awards", label: "Awards" },
      { href: "/membership", label: "Membership" },
      { href: "/verify", label: "Verify a Certificate" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms & Conditions" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/refunds", label: "Refund & Cancellation" },
      { href: "/legal/data-protection", label: "Data Protection" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={47} height={56} unoptimized />
            <span className="font-display text-lg font-bold text-white">GIRSD</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            The Global Institute of Research &amp; Skills Development advances
            research excellence and practical skills through conferences,
            courses, awards and a worldwide professional community.
          </p>
          <div className="mt-4 flex gap-3" aria-label="Social media">
            <a href={SITE.social.linkedin} aria-label="GIRSD on LinkedIn" className="rounded-full border border-slate-500 p-2 transition hover:border-gold hover:text-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.6 0h4.4v1.9h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V22h-4.6v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V22H7.8V8z"/></svg>
            </a>
            <a href={SITE.social.instagram} aria-label="GIRSD on Instagram" className="rounded-full border border-slate-500 p-2 transition hover:border-gold hover:text-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 2c-3.1 0-3.5 0-4.8.1-1.1.1-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.6-.3 1.7-.1 1.3-.1 1.6-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.6.3 1.7.3 1.3.1 1.6.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.6.3-1.7.1-1.3.1-1.6.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.4-.3-1.7-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.6-.3-1.7-.3-1.3-.1-1.6-.1-4.8-.1zm0 3.4a5.1 5.1 0 110 10.2 5.1 5.1 0 010-10.2zm0 8.4a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6zm5.3-8.6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/></svg>
            </a>
            <a href={SITE.social.youtube} aria-label="GIRSD on YouTube" className="rounded-full border border-slate-500 p-2 transition hover:border-gold hover:text-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="font-display text-base font-bold text-gold">{col.heading}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-navy-light">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs leading-relaxed text-slate-400">
          <p className="mb-1 font-semibold text-slate-300">{SITE.accreditation}</p>
          <p>{SITE.companyLine}</p>
          <p className="mt-1">
            © {new Date().getFullYear()} {SITE.company.legalName}. All rights reserved. ·{" "}
            <a href={`mailto:${SITE.email}`} className="hover:text-gold-light">{SITE.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
