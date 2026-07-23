"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import eventsJson from "@/content/events.json";
import coursesJson from "@/content/courses.json";
import awardsJson from "@/content/awards.json";
import newsJson from "@/content/news.json";

type Item = Record<string, any>;
type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "date" | "datetime" | "list";
  options?: string[];
  hint?: string;
  full?: boolean;
};

const SCHEMAS: Record<string, { label: string; idKey: string; fields: Field[]; template: Item; advanced?: string[] }> = {
  events: {
    label: "Events",
    idKey: "slug",
    fields: [
      { key: "acronym", label: "Short name / acronym", type: "text" },
      { key: "title", label: "Full title", type: "text", full: true },
      { key: "category", label: "Category", type: "select", options: ["Research Conferences", "Skills Development Workshops", "Global Education"] },
      { key: "slug", label: "URL slug", type: "text", hint: "lowercase-with-hyphens, must be unique" },
      { key: "date", label: "Start date & time", type: "datetime" },
      { key: "endDate", label: "End date & time", type: "datetime" },
      { key: "venue", label: "Venue", type: "text" },
      { key: "city", label: "City, Country", type: "text" },
      { key: "image", label: "Cover image path", type: "text", hint: "e.g. /ev-icmdr-2026.jpg" },
      { key: "summary", label: "Card summary", type: "textarea", full: true },
      { key: "description", label: "Full description", type: "textarea", full: true },
      { key: "themes", label: "Themes / tracks (one per line)", type: "list", full: true },
    ],
    advanced: ["tickets", "agenda", "speakers"],
    template: {
      slug: "new-event-2027", category: "Research Conferences", title: "", acronym: "",
      date: "2027-01-01T09:00:00Z", endDate: "2027-01-01T17:00:00Z", venue: "", city: "",
      image: "/hero.jpg", summary: "", description: "", themes: [],
      tickets: [{ id: "standard", name: "Standard Delegate", price: 99, includes: ["Full access"] }],
      agenda: [{ day: "Day 1", items: [{ time: "09:00", title: "Registration" }] }], speakers: [],
    },
  },
  courses: {
    label: "Courses",
    idKey: "slug",
    fields: [
      { key: "title", label: "Course title", type: "text", full: true },
      { key: "slug", label: "URL slug", type: "text", hint: "lowercase-with-hyphens, unique" },
      { key: "level", label: "Level", type: "select", options: ["Foundation", "Intermediate", "Advanced"] },
      { key: "category", label: "Category", type: "text" },
      { key: "duration", label: "Duration", type: "text", hint: "e.g. 6 weeks" },
      { key: "effort", label: "Weekly effort", type: "text", hint: "e.g. 3–4 hours per week" },
      { key: "price", label: "Price (£)", type: "number" },
      { key: "image", label: "Cover image path", type: "text", hint: "e.g. /co-ai-in-cybersecurity.jpg" },
      { key: "summary", label: "Card summary", type: "textarea", full: true },
      { key: "description", label: "Full description", type: "textarea", full: true },
      { key: "certification", label: "Certification", type: "textarea", full: true },
      { key: "support", label: "Support included (one per line)", type: "list" },
      { key: "assessment", label: "Assessment (one per line)", type: "list" },
    ],
    advanced: ["syllabus"],
    template: {
      slug: "new-course", title: "", level: "Foundation", duration: "6 weeks", effort: "3–4 hours per week",
      price: 295, category: "Skills Development Courses", image: "/co-generic.jpg", summary: "", description: "",
      syllabus: [{ module: "Module 1", topics: ["Topic"] }], support: ["Tutor support"], assessment: ["Final project"],
      certification: "GIRSD certificate on completion.",
    },
  },
  awards: {
    label: "Awards",
    idKey: "id",
    fields: [
      { key: "name", label: "Award name", type: "text", full: true },
      { key: "id", label: "ID", type: "text", hint: "unique, e.g. award-9" },
      { key: "type", label: "Type", type: "select", options: ["Individual", "Institutional"] },
      { key: "track", label: "Track", type: "text", hint: "e.g. Academia, Industry" },
      { key: "description", label: "Description", type: "textarea", full: true },
    ],
    template: { id: "award-new", type: "Individual", name: "", track: "Academia", description: "" },
  },
  news: {
    label: "News",
    idKey: "slug",
    fields: [
      { key: "title", label: "Headline", type: "text", full: true },
      { key: "slug", label: "URL slug", type: "text", hint: "lowercase-with-hyphens, unique" },
      { key: "author", label: "Author", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { key: "body", label: "Body (one paragraph per line)", type: "list", full: true },
    ],
    template: { slug: "new-article", title: "", date: new Date().toISOString().slice(0, 10), author: "GIRSD", excerpt: "", body: [""] },
  },
};

const INITIAL: Record<string, Item[]> = {
  events: eventsJson as Item[], courses: coursesJson as Item[], awards: awardsJson as Item[], news: newsJson as Item[],
};

function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(+d)) return iso.slice(0, 16);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function fromLocalInput(v: string) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(+d) ? v : d.toISOString();
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [collection, setCollection] = useState<keyof typeof SCHEMAS>("events");
  const [data, setData] = useState<Item[]>(INITIAL.events);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Item>({});
  const [advOpen, setAdvOpen] = useState(false);
  const [advText, setAdvText] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("girsd_admin_key");
    if (saved) { setKey(saved); setUnlocked(true); }
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    const c = key.trim(); if (!c) return;
    setSigningIn(true); setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: c }) });
      if (res.ok || res.status === 503) { sessionStorage.setItem("girsd_admin_key", c); setUnlocked(true); }
      else { const d = await res.json().catch(() => ({})); setLoginError(d.error ?? "Incorrect password."); }
    } catch { setLoginError("Network error — please try again."); }
    setSigningIn(false);
  }

  function switchCollection(c: keyof typeof SCHEMAS) { setCollection(c); setData(INITIAL[c]); setEditing(null); setStatus(null); }

  function openEditor(i: number) {
    const item = data[i]; const sch = SCHEMAS[collection];
    setEditing(i); setForm(JSON.parse(JSON.stringify(item)));
    const adv: Item = {}; (sch.advanced ?? []).forEach((k) => { if (item[k] !== undefined) adv[k] = item[k]; });
    setAdvText(Object.keys(adv).length ? JSON.stringify(adv, null, 2) : "");
    setAdvOpen(false); setStatus(null); setUploadMsg(null);
  }

  function setField(f: Field, value: string) {
    setForm((prev) => {
      const next = { ...prev };
      if (f.type === "number") next[f.key] = value === "" ? "" : Number(value);
      else if (f.type === "list") next[f.key] = value.split("\n").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "datetime") next[f.key] = fromLocalInput(value);
      else next[f.key] = value;
      return next;
    });
  }

  function applyForm() {
    const merged = { ...form };
    if (advText.trim()) {
      try { Object.assign(merged, JSON.parse(advText)); }
      catch { setStatus({ kind: "err", msg: "Advanced options: invalid JSON." }); return; }
    }
    const next = [...data]; next[editing!] = merged;
    setData(next); setEditing(null);
    setStatus({ kind: "ok", msg: "Saved locally — press “Publish to live site” to make it live." });
  }

  function addItem() {
    const next = [...data, JSON.parse(JSON.stringify(SCHEMAS[collection].template))];
    setData(next); setTimeout(() => openEditor(next.length - 1), 0);
  }
  function removeItem(i: number) {
    if (!confirm("Delete this item? Takes effect when you publish.")) return;
    setData(data.filter((_, idx) => idx !== i)); setEditing(null);
  }

  async function publish() {
    setPublishing(true); setStatus(null);
    try {
      const res = await fetch("/api/admin/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ collection, data, adminKey: key }) });
      const d = await res.json();
      setStatus(res.ok ? { kind: "ok", msg: d.message } : { kind: "err", msg: d.error ?? "Publish failed" });
    } catch { setStatus({ kind: "err", msg: "Network error — try again." }); }
    setPublishing(false);
  }

  async function uploadImage(file: File) {
    setUploading(true); setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("adminKey", key);
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.path) {
        setForm((p) => ({ ...p, image: d.path }));
        setUploadMsg("Photo uploaded — it goes live when you publish.");
      } else {
        // Local preview fallback (won't persist until GitHub upload is configured)
        setForm((p) => ({ ...p, image: URL.createObjectURL(file) }));
        setUploadMsg(d.error ?? "Upload not configured — showing local preview only.");
      }
    } catch {
      setUploadMsg("Upload failed — please try again.");
    }
    setUploading(false);
  }

  if (!unlocked) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center px-4 py-16" style={{ backgroundColor: "#071527" }}>
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image src="/logo-white.png" alt="GIRSD" width={200} height={74} unoptimized className="w-52 h-auto" />
            <h1 className="mt-4 font-display text-2xl font-bold text-white">Admin Console</h1>
            <p className="mt-1 text-sm text-slate-400">Content management — staff sign in</p>
          </div>
          <form onSubmit={signIn} className="rounded-md bg-white p-8 shadow-2xl">
            <label htmlFor="adminuser" className="label">Username</label>
            <input id="adminuser" type="text" className="input" autoComplete="username" defaultValue="admin" />
            <label htmlFor="adminkey" className="label mt-4">Password</label>
            <input id="adminkey" type="password" className="input" autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter admin password" autoFocus />
            {loginError && <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{loginError}</p>}
            <button type="submit" disabled={signingIn} className="btn-gold mt-5 w-full disabled:opacity-60">{signingIn ? "Signing in…" : "Sign in"}</button>
            <p className="mt-4 text-center text-[11px] text-slate-400">Restricted to authorised GIRSD staff. Password = your <span className="font-semibold">ADMIN_KEY</span>.</p>
          </form>
        </div>
      </section>
    );
  }

  const sch = SCHEMAS[collection];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Content Admin</h1>
          <p className="mt-1 text-sm text-muted">Add, edit and delete content, then publish — no code required.</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem("girsd_admin_key"); setUnlocked(false); }} className="text-sm text-muted underline">Sign out</button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {(Object.keys(SCHEMAS) as (keyof typeof SCHEMAS)[]).map((c) => (
          <button key={c} role="tab" aria-selected={collection === c} onClick={() => switchCollection(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${collection === c ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {SCHEMAS[c].label} <span className="opacity-60">({INITIAL[c].length})</span>
          </button>
        ))}
      </div>

      {status && <p role="status" className={`mt-5 rounded-md px-4 py-3 text-sm font-medium ${status.kind === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{status.msg}</p>}

      <div className="mt-6 space-y-3">
        {data.map((item, i) => (
          <div key={i} className="card flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-4">
              {item.image && <img src={item.image} alt="" className="hidden h-12 w-20 shrink-0 rounded object-cover sm:block" />}
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{String(item.name ?? item.title ?? item.slug)}</p>
                <p className="truncate text-xs text-muted">{String(item[sch.idKey] ?? "")}{item.date ? ` · ${String(item.date).slice(0, 10)}` : ""}{item.price !== undefined ? ` · £${item.price}` : ""}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => openEditor(i)} className="btn-outline px-3 py-1.5 text-sm">Edit</button>
              <button onClick={() => removeItem(i)} className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={addItem} className="btn-outline">+ Add {sch.label.replace(/s$/, "")}</button>
        <button onClick={publish} disabled={publishing} className="btn-gold disabled:opacity-60">{publishing ? "Publishing…" : "Publish to live site"}</button>
      </div>
      <p className="mt-3 text-xs text-muted">Publishing saves to the site and redeploys automatically (~2 minutes). Required fields are validated first.</p>

      {editing !== null && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="my-6 w-full max-w-3xl rounded-md bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold">Edit {sch.label.replace(/s$/, "")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sch.fields.map((f) => {
                const val = form[f.key];
                const display = f.type === "list" ? (Array.isArray(val) ? val.join("\n") : "") : f.type === "datetime" ? toLocalInput(val ?? "") : (val ?? "");
                if (f.key === "image") {
                  return (
                    <div key={f.key} className="sm:col-span-2">
                      <label className="label">{f.label}</label>
                      <div className="flex flex-wrap items-center gap-4">
                        {form.image ? (
                          <img src={form.image} alt="Preview" className="h-20 w-32 rounded object-cover ring-1 ring-line" />
                        ) : (
                          <div className="flex h-20 w-32 items-center justify-center rounded bg-slate-100 text-xs text-muted">No image</div>
                        )}
                        <div className="flex-1 min-w-[200px]">
                          <label className="btn-outline cursor-pointer text-sm">
                            {uploading ? "Uploading…" : "Upload photo"}
                            <input type="file" accept="image/*" className="hidden" disabled={uploading}
                              onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadImage(file); }} />
                          </label>
                          <input type="text" className="input mt-2" value={form.image ?? ""} placeholder="/uploads/photo.jpg"
                            onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
                          {uploadMsg && <p className="mt-1 text-xs text-muted">{uploadMsg}</p>}
                          {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={f.key} className={f.full || f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                    <label htmlFor={`f-${f.key}`} className="label">{f.label}</label>
                    {f.type === "textarea" || f.type === "list" ? (
                      <textarea id={`f-${f.key}`} className="input" rows={f.type === "list" ? 4 : 3} value={display} onChange={(e) => setField(f, e.target.value)} />
                    ) : f.type === "select" ? (
                      <select id={`f-${f.key}`} className="input" value={display} onChange={(e) => setField(f, e.target.value)}>
                        {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input id={`f-${f.key}`} type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "datetime" ? "datetime-local" : "text"} className="input" value={display} onChange={(e) => setField(f, e.target.value)} />
                    )}
                    {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
                  </div>
                );
              })}
            </div>

            {sch.advanced && (
              <div className="mt-5 rounded-md border border-line">
                <button type="button" onClick={() => setAdvOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-navy">
                  Advanced: {sch.advanced.join(", ")} <span>{advOpen ? "−" : "+"}</span>
                </button>
                {advOpen && (
                  <div className="border-t border-line p-4">
                    <p className="mb-2 text-xs text-muted">These structured sections (tickets, agenda, etc.) are edited as JSON. Leave untouched if not needed.</p>
                    <textarea className="input font-mono text-xs" rows={10} value={advText} onChange={(e) => setAdvText(e.target.value)} spellCheck={false} />
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
              <button onClick={applyForm} className="btn-navy">Save changes</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
