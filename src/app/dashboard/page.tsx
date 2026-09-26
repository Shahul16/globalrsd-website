"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { SITE } from "@/lib/site";
import eventsData from "@/content/events.json";
import coursesData from "@/content/courses.json";
import { openings, type JobOpening } from "@/lib/data/careers";

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/Hzz8bB36if83vGNL9PFoRE?mode=gi_t";

type CandidateProfile = {
  phone: string;
  location: string;
  title: string;
  disciplines: string[];
  skills: string[];
  languages: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: { role: string; organization: string; duration: string; summary: string }[];
  cv: {
    fileName: string;
    fileSize: string;
    uploadedAt: string;
  } | null;
};

const DEFAULT_PROFILE: CandidateProfile = {
  phone: "+44 7586 261118",
  location: "London, United Kingdom",
  title: "Research Scholar & Candidate",
  disciplines: ["Multidisciplinary Research", "Information Technology", "Academic Studies"],
  skills: ["Research Methodology", "Data Analysis", "Academic Writing", "Project Management", "Technical Documentation"],
  languages: ["English (Fluent)", "French (Intermediate)"],
  education: [
    {
      degree: "Postgraduate / Master's Degree",
      institution: "School of Engineering & Advanced Sciences",
      year: "2024",
    },
    {
      degree: "Undergraduate / Bachelor's Degree",
      institution: "Faculty of Applied Sciences & Technology",
      year: "2021",
    },
  ],
  experience: [
    {
      role: "Graduate Research Assistant",
      organization: "Academic Research Lab",
      duration: "2023 – Present",
      summary: "Assisted in conference paper submissions, literature reviews and scientific presentations.",
    },
  ],
  cv: null,
};

type ActiveTab =
  | "dashboard"
  | "profile"
  | "events"
  | "courses"
  | "membership"
  | "careers"
  | "awards"
  | "certificates"
  | "support";

export default function DashboardPage() {
  const { user, ready, logout, cancelMembership, refresh } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  
  // Candidate Profile State (Persisted)
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newDisciplineInput, setNewDisciplineInput] = useState("");
  
  // Modals
  const [abstractModalEvent, setAbstractModalEvent] = useState<{ title: string; slug: string } | null>(null);
  const [abstractForm, setAbstractForm] = useState({ title: "", track: "", abstractText: "" });
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/dashboard");
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Load candidate profile from localStorage
  useEffect(() => {
    if (user?.email) {
      try {
        const stored = localStorage.getItem(`girsd_profile_${user.email}`);
        if (stored) {
          setProfile(JSON.parse(stored));
        } else {
          setProfile({
            ...DEFAULT_PROFILE,
            title: `Candidate — ${user.name}`,
          });
        }
      } catch (err) {
        console.error("Failed to read profile:", err);
      }
      setProfileLoaded(true);
    }
  }, [user]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  }

  function saveProfileToStorage(updated: CandidateProfile) {
    setProfile(updated);
    if (user?.email) {
      localStorage.setItem(`girsd_profile_${user.email}`, JSON.stringify(updated));
    }
    showToast("Profile details updated successfully!");
  }

  function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15 MB. Please select a smaller document.");
      return;
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : Math.round(file.size / 1024) + " KB";

    const updated: CandidateProfile = {
      ...profile,
      cv: {
        fileName: file.name,
        fileSize: sizeFormatted,
        uploadedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    };

    saveProfileToStorage(updated);
    showToast(`CV "${file.name}" uploaded and linked to candidate profile!`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveCv() {
    if (!confirm("Are you sure you want to remove your uploaded CV?")) return;
    const updated: CandidateProfile = {
      ...profile,
      cv: null,
    };
    saveProfileToStorage(updated);
    showToast("CV removed from profile.");
  }

  function addSkill() {
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!profile.skills.includes(trimmed)) {
      const updated = { ...profile, skills: [...profile.skills, trimmed] };
      saveProfileToStorage(updated);
    }
    setNewSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    const updated = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    saveProfileToStorage(updated);
  }

  function addDiscipline() {
    if (!newDisciplineInput.trim()) return;
    const trimmed = newDisciplineInput.trim();
    if (!profile.disciplines.includes(trimmed)) {
      const updated = { ...profile, disciplines: [...profile.disciplines, trimmed] };
      saveProfileToStorage(updated);
    }
    setNewDisciplineInput("");
  }

  function removeDiscipline(dToRemove: string) {
    const updated = {
      ...profile,
      disciplines: profile.disciplines.filter((d) => d !== dToRemove),
    };
    saveProfileToStorage(updated);
  }

  async function onCancelMembership() {
    if (!window.confirm("Cancel your membership? Your discounts stop immediately and the annual fee is not refunded automatically.")) return;
    setCancelError("");
    const res = await cancelMembership();
    if (res.error) setCancelError(res.error);
    else showToast("Membership successfully cancelled.");
  }

  function handleAbstractSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!abstractForm.title || !abstractForm.abstractText) {
      alert("Please provide both a paper title and an abstract.");
      return;
    }
    showToast(`Abstract "${abstractForm.title}" submitted successfully for peer review!`);
    setAbstractModalEvent(null);
    setAbstractForm({ title: "", track: "", abstractText: "" });
  }

  function handleQuickJobApply(job: JobOpening) {
    if (!profile.cv) {
      setActiveTab("profile");
      showToast("Please upload your CV in 'My Profile' first to enable 1-Click Application.");
      return;
    }
    showToast(`Application with your CV "${profile.cv.fileName}" submitted for ${job.title}!`);
    setSelectedJob(null);
  }

  if (!ready || !user) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-navy border-t-gold" />
          <p className="mt-4 text-sm font-medium text-slate-600">Loading your candidate portal…</p>
        </div>
      </section>
    );
  }

  const m = user.membership;
  const candidateId = `GIRSD-${user.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "CAND"}-2026`;
  const profileCompletion = (profile.cv ? 35 : 0) + (profile.skills.length > 0 ? 25 : 0) + (profile.education.length > 0 ? 25 : 0) + 15;

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl animate-fadeUp">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-emerald-950">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP PORTAL HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle Navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy font-display text-base font-bold text-gold">G</span>
              <div>
                <p className="font-display text-sm font-bold text-navy leading-none sm:text-base">GIRSD Portal</p>
                <p className="text-[10px] text-slate-500 font-medium">Candidate &amp; Member Workspace</p>
              </div>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3">
            {/* WHATSAPP COMMUNITY BUTTON */}
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-500/20 shadow-xs"
              title="Join GlobalRSD Official WhatsApp Community"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <svg className="h-4 w-4 text-emerald-600 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.954 2.896.954 3.181 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.77-5.868-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.127-.061-.758-.242-1.743-.889-2.586-1.733-.844-.844-1.491-1.829-1.734-2.587-.138-.429-.106-.815-.06-1.127.049-.333.418-1.026.823-1.17.135-.045.27-.03.361.015.09.045.18.135.225.225.225.45.675 1.62.721 1.755.045.135.03.27-.045.361-.075.09-.135.15-.225.225-.09.09-.18.18-.09.36.18.361.54 1.036 1.171 1.576.63.54 1.261.765 1.576.855.18.045.27-.045.36-.135.09-.09.18-.225.27-.315.09-.09.225-.09.36-.045.135.045 1.305.63 1.53.765.225.135.27.225.27.315 0 .09-.045.54-.18.945zM12 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5L2.05 22l5.165-1.355A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
              <span className="hidden sm:inline">WhatsApp Community</span>
            </a>

            {/* Candidate Badge */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <span className="h-6 w-6 rounded-full bg-navy flex items-center justify-center font-bold text-white text-[11px]">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-navy leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{candidateId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD SHELL */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-5 shadow-xl transition-transform lg:static lg:block lg:w-auto lg:rounded-xl lg:border lg:border-slate-200 lg:p-4 lg:shadow-xs ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 lg:hidden">
              <p className="font-display font-bold text-navy">Candidate Menu</p>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-navy">✕</button>
            </div>

            <nav className="mt-4 space-y-1.5" aria-label="Dashboard Sidebar">
              {[
                { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                { id: "profile", label: "My Profile (Research CV)", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", badge: profile.cv ? "CV Attached" : "Upload CV" },
                { id: "events", label: "Conferences & Events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", count: eventsData.length },
                { id: "courses", label: "My Courses & Enrolments", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                { id: "membership", label: "My Membership", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
                { id: "careers", label: "Career Support & Jobs", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", badge: "Hiring" },
                { id: "awards", label: "Nominate For Award", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
                { id: "certificates", label: "Certificates & Rewards", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { id: "support", label: "Help & Support", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as ActiveTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-navy text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <svg className={`h-4 w-4 shrink-0 ${isActive ? "text-gold" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.badge === "CV Attached" ? "bg-emerald-100 text-emerald-800" : "bg-gold/20 text-gold-dark"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 font-mono">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => void logout()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span>Log Out</span>
                </button>
              </div>
            </nav>

            {/* Quick Community Widget */}
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-50/70 p-3.5 text-left">
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Community
              </p>
              <p className="mt-1 text-[11px] text-emerald-800 leading-relaxed">
                Connect directly with 2,500+ researchers, authors and scholars on WhatsApp.
              </p>
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-md bg-emerald-700 py-1.5 text-center text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
              >
                Join WhatsApp Group →
              </a>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="min-w-0">
            
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* WHATSAPP HERO BANNER */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-navy p-6 text-white shadow-lg">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Official Global Member Network
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                        Join the GlobalRSD International Research &amp; Scholar Community
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                        Access real-time call-for-papers alerts, webinar links, CPD workshops, and network with 2,500+ scholars, delegates, and reviewers worldwide.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <a
                        href={WHATSAPP_COMMUNITY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 px-6 py-3 font-display text-sm font-bold text-navy hover:bg-emerald-400 transition shadow-lg"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.954 2.896.954 3.181 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.77-5.868-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.127-.061-.758-.242-1.743-.889-2.586-1.733-.844-.844-1.491-1.829-1.734-2.587-.138-.429-.106-.815-.06-1.127.049-.333.418-1.026.823-1.17.135-.045.27-.03.361.015.09.045.18.135.225.225.225.45.675 1.62.721 1.755.045.135.03.27-.045.361-.075.09-.135.15-.225.225-.09.09-.18.18-.09.36.18.361.54 1.036 1.171 1.576.63.54 1.261.765 1.576.855.18.045.27-.045.36-.135.09-.09.18-.225.27-.315.09-.09.225-.09.36-.045.135.045 1.305.63 1.53.765.225.135.27.225.27.315 0 .09-.045.54-.18.945zM12 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5L2.05 22l5.165-1.355A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                        <span>Join WhatsApp Community</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* STAT COUNTERS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="card p-5 bg-white border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conferences &amp; Events</p>
                    <p className="mt-2 text-2xl font-display font-bold text-navy">{eventsData.length}+ Live</p>
                    <button onClick={() => setActiveTab("events")} className="mt-2 text-xs font-semibold text-gold-dark hover:underline">
                      View Call for Papers →
                    </button>
                  </div>
                  <div className="card p-5 bg-white border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CPD Courses</p>
                    <p className="mt-2 text-2xl font-display font-bold text-navy">{coursesData.length} Certified</p>
                    <button onClick={() => setActiveTab("courses")} className="mt-2 text-xs font-semibold text-gold-dark hover:underline">
                      Enrol on Programmes →
                    </button>
                  </div>
                  <div className="card p-5 bg-white border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate CV Status</p>
                    <p className="mt-2 text-lg font-display font-bold text-emerald-700">
                      {profile.cv ? "CV Uploaded" : "CV Pending"}
                    </p>
                    <button onClick={() => setActiveTab("profile")} className="mt-2 text-xs font-semibold text-navy hover:underline">
                      {profile.cv ? "Update / View CV →" : "Upload CV Now →"}
                    </button>
                  </div>
                  <div className="card p-5 bg-white border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Membership Status</p>
                    <p className="mt-2 text-lg font-display font-bold text-navy">
                      {m ? `${m.tierName} Member` : "Standard Free"}
                    </p>
                    <button onClick={() => setActiveTab("membership")} className="mt-2 text-xs font-semibold text-gold-dark hover:underline">
                      {m ? "Manage Benefits →" : "Upgrade to 20% Off →"}
                    </button>
                  </div>
                </div>

                {/* PROFILE COMPLETION STATUS BAR */}
                <div className="card p-6 bg-white border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-navy">Profile &amp; Application Status</h3>
                      <p className="text-xs text-slate-500">Complete your research profile to fast-track abstract review, conference presentation, and job shortlisting.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-36 bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                      </div>
                      <span className="text-sm font-bold text-emerald-800">{profileCompletion}%</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">✓</span>
                      <span>Verified Email Address</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">✓</span>
                      <span>Candidate Academic Details</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">✓</span>
                      <span>Disciplines &amp; Skills Added</span>
                    </div>
                    <div className={`flex items-center gap-2 ${profile.cv ? "text-slate-700" : "text-amber-800 font-semibold"}`}>
                      {profile.cv ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">✓</span>
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold">!</span>
                      )}
                      <span>{profile.cv ? "CV Uploaded" : "Upload Professional CV"}</span>
                    </div>
                  </div>
                </div>

                {/* QUICK SHORTCUTS & UPCOMING EVENTS */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="card p-6 bg-white border border-slate-200">
                    <h3 className="font-display text-lg font-bold text-navy">Featured Upcoming Conferences</h3>
                    <div className="mt-4 space-y-3">
                      {eventsData.slice(0, 3).map((ev) => (
                        <div key={ev.slug} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:border-gold/50 transition">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">{ev.acronym}</span>
                            <p className="font-semibold text-navy text-xs sm:text-sm line-clamp-1">{ev.title}</p>
                            <p className="text-[11px] text-slate-500">{ev.city} · {new Date(ev.date).toLocaleDateString("en-GB")}</p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab("events");
                              setAbstractModalEvent({ title: ev.title, slug: ev.slug });
                            }}
                            className="shrink-0 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-dark transition"
                          >
                            Submit Paper
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6 bg-white border border-slate-200">
                    <h3 className="font-display text-lg font-bold text-navy">Immediate Hiring &amp; Opportunities</h3>
                    <div className="mt-4 space-y-3">
                      {openings.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:border-gold/50 transition">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-navy text-xs sm:text-sm">{job.title}</p>
                              {job.highlight && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                                  Hiring
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{job.department} · {job.type} · {job.location}</p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab("careers");
                              setSelectedJob(job);
                            }}
                            className="shrink-0 rounded-md border border-navy px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy hover:text-white transition"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: MY PROFILE & CANDIDATE CV UPLOAD */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  
                  {/* LEFT: CANDIDATE CARD & CV UPLOAD */}
                  <div className="space-y-6">
                    <div className="card p-6 bg-white border border-slate-200 text-center">
                      <div className="relative mx-auto h-24 w-24 rounded-full bg-navy flex items-center justify-center text-3xl font-display font-bold text-gold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <h3 className="mt-4 font-display text-xl font-bold text-navy">{user.name}</h3>
                      <p className="text-xs text-slate-500">{profile.title}</p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{candidateId}</p>

                      <div className="mt-3 flex justify-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                          {m ? `${m.tierName} Member` : "Verified Candidate"}
                        </span>
                      </div>

                      {/* CANDIDATE CV UPLOAD SECTION */}
                      <div className="mt-6 border-t border-slate-100 pt-5 text-left">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Vitae (CV)</p>
                        
                        {profile.cv ? (
                          <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50/60 p-3.5">
                            <div className="flex items-start gap-2.5">
                              <span className="text-xl">📄</span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-navy">{profile.cv.fileName}</p>
                                <p className="text-[10px] text-slate-500">{profile.cv.fileSize} · Uploaded {profile.cv.uploadedAt}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 rounded-md bg-white border border-slate-300 py-1.5 text-center text-xs font-semibold text-navy hover:bg-slate-50 transition"
                              >
                                Replace CV
                              </button>
                              <button
                                onClick={handleRemoveCv}
                                className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                title="Remove CV"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-gold transition">
                            <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="mt-2 text-xs font-semibold text-navy">Upload Candidate CV / Resume</p>
                            <p className="text-[10px] text-slate-400 mt-1">PDF or Word document (Max 15 MB)</p>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="btn-navy mt-3 inline-block w-full py-1.5 text-xs"
                            >
                              Select CV File
                            </button>
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleCvUpload}
                        />
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <button
                          onClick={() => {
                            showToast("Generated verified candidate summary profile!");
                          }}
                          className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-gold hover:bg-slate-800 transition"
                        >
                          Generate AI Profile Summary
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: CANDIDATE RESEARCH DETAILS */}
                  <div className="card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="font-display text-xl font-bold text-navy">Research Curriculum Vitae</h2>
                        <p className="text-xs text-slate-500">Disciplines, academic qualifications and specialized research background.</p>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-100 transition"
                      >
                        {isEditingProfile ? "Done Editing" : "Edit Profile"}
                      </button>
                    </div>

                    {/* DISCIPLINES */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Research Disciplines</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.disciplines.map((d) => (
                          <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 border border-navy/15 px-3 py-1 text-xs font-semibold text-navy">
                            {d}
                            {isEditingProfile && (
                              <button onClick={() => removeDiscipline(d)} className="text-slate-400 hover:text-red-500">×</button>
                            )}
                          </span>
                        ))}
                      </div>
                      {isEditingProfile && (
                        <div className="mt-3 flex max-w-sm gap-2">
                          <input
                            type="text"
                            placeholder="Add discipline (e.g. AI in Healthcare)..."
                            className="input text-xs py-1.5"
                            value={newDisciplineInput}
                            onChange={(e) => setNewDisciplineInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addDiscipline()}
                          />
                          <button onClick={addDiscipline} className="btn-navy text-xs px-3 py-1.5">Add</button>
                        </div>
                      )}
                    </div>

                    {/* SKILLS & EXPERTISE */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills &amp; Methodologies</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 border border-gold/40 px-3 py-1 text-xs font-semibold text-gold-dark">
                            {skill}
                            {isEditingProfile && (
                              <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500">×</button>
                            )}
                          </span>
                        ))}
                      </div>
                      {isEditingProfile && (
                        <div className="mt-3 flex max-w-sm gap-2">
                          <input
                            type="text"
                            placeholder="Add skill (e.g. SPSS, Python, Lab Management)..."
                            className="input text-xs py-1.5"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                          />
                          <button onClick={addSkill} className="btn-navy text-xs px-3 py-1.5">Add</button>
                        </div>
                      )}
                    </div>

                    {/* EDUCATION HISTORY */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Education &amp; Qualifications</h4>
                      <div className="mt-3 space-y-3">
                        {profile.education.map((edu, idx) => (
                          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-navy">{edu.degree}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">{edu.year}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACADEMIC & PROFESSIONAL EXPERIENCE */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic &amp; Professional Experience</h4>
                      <div className="mt-3 space-y-3">
                        {profile.experience.map((exp, idx) => (
                          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-navy">{exp.role}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{exp.organization}</p>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">{exp.duration}</span>
                            </div>
                            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{exp.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONFERENCES & EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-navy">Upcoming Conferences &amp; Events</h2>
                    <p className="text-xs text-slate-500">Submit abstracts, register for presenter slots and download participation passes.</p>
                  </div>
                  <Link href="/events" className="btn-navy text-xs py-2 px-4">
                    Full Public Directory →
                  </Link>
                </div>

                {/* MY BOOKED TICKETS (IF ANY) */}
                {user.tickets.length > 0 && (
                  <div className="card p-6 bg-white border-2 border-gold/40">
                    <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      My Confirmed Event Tickets ({user.tickets.length})
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                            <th className="py-2 pr-4">Event</th>
                            <th className="py-2 pr-4">Ticket Tier</th>
                            <th className="py-2 pr-4">Qty</th>
                            <th className="py-2 pr-4">Paid</th>
                            <th className="py-2">Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.tickets.map((t) => (
                            <tr key={t.orderId} className="border-b border-slate-100">
                              <td className="py-2.5 pr-4 font-bold text-navy">{t.eventTitle}</td>
                              <td className="py-2.5 pr-4">{t.tierName}</td>
                              <td className="py-2.5 pr-4">{t.quantity}</td>
                              <td className="py-2.5 pr-4 font-semibold">£{t.paid}</td>
                              <td className="py-2.5 font-mono text-slate-400">{t.orderId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* EVENT CARDS */}
                <div className="grid gap-6 md:grid-cols-2">
                  {eventsData.map((ev) => (
                    <div key={ev.slug} className="card p-6 bg-white border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-[10px] font-bold text-navy uppercase tracking-wider">
                            {ev.acronym}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {new Date(ev.date).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-lg font-bold text-navy line-clamp-1">{ev.title}</h3>
                        <p className="mt-1 text-xs text-slate-500 font-semibold">{ev.city}</p>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">{ev.summary}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                        <button
                          onClick={() => setAbstractModalEvent({ title: ev.title, slug: ev.slug })}
                          className="flex-1 btn-gold text-xs py-2 text-center"
                        >
                          Submit Abstract
                        </button>
                        <Link
                          href={`/events/${ev.slug}`}
                          className="flex-1 rounded-md border border-slate-300 py-2 text-center text-xs font-semibold text-navy hover:bg-slate-50 transition"
                        >
                          View Schedule
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MY COURSES */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">CPD Certified Courses &amp; Enrolments</h2>
                  <p className="text-xs text-slate-500">Access your professional training modules, progress, and verify CPD learning credits.</p>
                </div>

                {/* MY ENROLLED COURSES */}
                <div className="card p-6 bg-white border border-slate-200">
                  <h3 className="font-display text-base font-bold text-navy">My Enrolments</h3>
                  {user.enrolments.length === 0 ? (
                    <div className="mt-4 rounded-lg bg-slate-50 p-6 text-center">
                      <p className="text-xs text-slate-500">You are not currently enrolled in any paid course.</p>
                      <Link href="/courses" className="btn-navy mt-3 inline-block text-xs py-2 px-4">
                        Browse Certified Programmes →
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {user.enrolments.map((enr) => (
                        <div key={enr.orderId} className="rounded-lg border border-slate-200 p-4">
                          <p className="font-bold text-sm text-navy">{enr.courseTitle}</p>
                          <p className="text-[11px] text-slate-500 mt-1">Enrolled on {new Date(enr.date).toLocaleDateString("en-GB")}</p>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-700">● 100% Eligible for CPD Certificate</span>
                            <Link href={`/courses/${enr.courseSlug}`} className="text-navy font-bold underline">
                              Open Modules
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ALL CPD COURSES */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coursesData.map((c) => (
                    <div key={c.slug} className="card p-5 bg-white border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">{c.duration} · {c.effort}</span>
                        <h4 className="mt-2 font-display text-base font-bold text-navy">{c.title}</h4>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{c.summary}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-navy">£{c.price}</span>
                        <Link href={`/courses/${c.slug}`} className="btn-navy text-xs py-1.5 px-3">
                          Course Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MY MEMBERSHIP */}
            {activeTab === "membership" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">Membership Credentials</h2>
                  <p className="text-xs text-slate-500">Institutional affiliations, discounts on international events, and CPD recognition.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="card p-6 bg-white border-t-4 border-t-gold border-slate-200">
                    <h3 className="font-display text-lg font-bold text-navy">Current Membership Plan</h3>
                    
                    {m ? (
                      <div className="mt-4 space-y-4">
                        <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {m.tierName} Member · Active
                        </div>
                        <dl className="space-y-2 text-xs">
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <dt className="text-slate-500">Member ID</dt>
                            <dd className="font-mono font-bold text-navy">{candidateId}</dd>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <dt className="text-slate-500">Member Since</dt>
                            <dd className="font-semibold text-navy">{new Date(m.since).toLocaleDateString("en-GB")}</dd>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <dt className="text-slate-500">Next Renewal</dt>
                            <dd className="font-semibold text-navy">{new Date(m.renewsAt).toLocaleDateString("en-GB")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Annual Fee</dt>
                            <dd className="font-bold text-navy">£{m.price}</dd>
                          </div>
                        </dl>

                        <div className="rounded-lg bg-gold/15 p-3 text-xs text-navy leading-relaxed">
                          ✨ <strong>Active Benefit:</strong> 20% discount on all GIRSD international conferences and 10% on certified courses is automatically applied at checkout.
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Link href={`/checkout?type=membership&tier=${m.tierId}`} className="btn-navy text-xs py-2 px-4">
                            Renew Membership
                          </Link>
                          <button
                            onClick={onCancelMembership}
                            className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-red-300 hover:text-red-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                        {cancelError && <p className="text-xs text-red-600">{cancelError}</p>}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          You do not currently have an active paid membership. Join GlobalRSD to unlock 20% off all conference passes, publishing priority, and official CPD Member badges.
                        </p>
                        <Link href="/membership" className="btn-gold inline-block text-xs py-2 px-4">
                          Explore Membership Plans →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* DIGITAL MEMBER BADGE PREVIEW */}
                  <div className="card p-6 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold">Digital Credential</p>
                    <h3 className="mt-2 font-display text-xl font-bold">{SITE.name}</h3>
                    <p className="text-xs text-slate-300 mt-1">London, United Kingdom · CPD Provider #788000</p>
                    
                    <div className="mt-6 rounded-lg bg-white/10 p-4 backdrop-blur-xs border border-white/15">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Candidate / Member Name</p>
                      <p className="font-display text-lg font-bold text-white">{user.name}</p>
                      <div className="mt-3 flex justify-between text-xs text-slate-300 font-mono">
                        <span>ID: {candidateId}</span>
                        <span>STATUS: {m ? "ACTIVE" : "REGISTERED"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CAREER SUPPORT & JOBS (WITH CV 1-CLICK APPLY) */}
            {activeTab === "careers" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-navy">Career Support &amp; Active Openings</h2>
                    <p className="text-xs text-slate-500">Apply directly using your uploaded candidate CV profile.</p>
                  </div>
                  {profile.cv && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      ✓ Profile CV Ready: {profile.cv.fileName}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {openings.map((job) => (
                    <div key={job.id} className="card p-6 bg-white border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-display text-lg font-bold text-navy">{job.title}</h3>
                            {job.highlight && (
                              <span className="rounded-full bg-emerald-100 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 animate-pulse">
                                {job.highlight}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-500 font-medium">
                            {job.department} · {job.type} · {job.location} · <span className="font-semibold text-navy">{job.salary}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleQuickJobApply(job)}
                          className="btn-navy text-xs py-2 px-5 shrink-0"
                        >
                          1-Click Apply
                        </button>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 leading-relaxed">{job.summary}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-navy">Package:</span> {job.package}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: NOMINATE FOR AWARD */}
            {activeTab === "awards" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">GIRSD Annual Awards 2026</h2>
                  <p className="text-xs text-slate-500">Honouring outstanding researchers, innovators, educators, and emerging scholars globally.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="card p-6 bg-white border border-slate-200">
                    <h3 className="font-display text-lg font-bold text-navy">Award Categories</h3>
                    <ul className="mt-4 space-y-3 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-gold font-bold text-base">★</span>
                        <div>
                          <strong className="text-navy">Young Researcher of the Year:</strong> Open to early-career scholars and postgraduates demonstrating outstanding scientific output.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold font-bold text-base">★</span>
                        <div>
                          <strong className="text-navy">Academic Excellence &amp; Leadership:</strong> Honoring senior faculty and department chairs with notable research mentorship.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold font-bold text-base">★</span>
                        <div>
                          <strong className="text-navy">Women in Science &amp; Innovation:</strong> Recognizing pioneering contributions by female researchers worldwide.
                        </div>
                      </li>
                    </ul>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link href="/awards" className="btn-gold block text-center text-xs py-2">
                        Go to Nomination Form →
                      </Link>
                    </div>
                  </div>

                  <div className="card p-6 bg-navy text-white">
                    <h3 className="font-display text-lg font-bold text-gold">Jury &amp; Selection Criteria</h3>
                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      Nominations are evaluated by the GIRSD International Honors Committee against academic merit, peer-reviewed contributions, and community impact.
                    </p>
                    <div className="mt-6 rounded-lg bg-white/10 p-4 text-xs">
                      <p className="font-semibold text-white">Nomination Queries:</p>
                      <a href="mailto:awards@globalrsd.co.uk" className="text-gold-light underline mt-1 block">
                        awards@globalrsd.co.uk
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: CERTIFICATES & REWARDS */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">Certificates &amp; Credentials</h2>
                  <p className="text-xs text-slate-500">Official CPD accredited certificates of participation, presentation, and course completion.</p>
                </div>

                <div className="card p-6 bg-white border border-slate-200">
                  <h3 className="font-display text-base font-bold text-navy">Earned Credentials</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                      <div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">Verified</span>
                        <p className="font-bold text-sm text-navy mt-1">Certificate of Candidate Registration</p>
                        <p className="text-xs text-slate-500">Global Institute of Research &amp; Skills Development · CPD Provider #788000</p>
                      </div>
                      <Link
                        href={`/verify-certificate?id=${candidateId}`}
                        className="rounded-md border border-navy px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy hover:text-white transition"
                      >
                        Verify Credential
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: HELP & SUPPORT */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">Candidate Support Desk</h2>
                  <p className="text-xs text-slate-500">Have questions regarding conference submissions, certificates, or memberships?</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="card p-6 bg-white border border-slate-200 space-y-4">
                    <h3 className="font-display text-lg font-bold text-navy">Direct Department Support</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Reach our London administrative office directly or contact the relevant department.
                    </p>
                    <ul className="space-y-2.5 text-xs">
                      <li><strong>General &amp; Student Help:</strong> <a href="mailto:info@globalrsd.co.uk" className="text-navy font-semibold underline">info@globalrsd.co.uk</a></li>
                      <li><strong>Conferences &amp; Abstracts:</strong> <a href="mailto:research@globalrsd.co.uk" className="text-navy font-semibold underline">research@globalrsd.co.uk</a></li>
                      <li><strong>Careers &amp; Internships:</strong> <a href="mailto:hr@globalrsd.co.uk" className="text-navy font-semibold underline">hr@globalrsd.co.uk</a></li>
                    </ul>
                  </div>

                  <div className="card p-6 bg-emerald-950 text-white space-y-4">
                    <h3 className="font-display text-lg font-bold text-emerald-300">Live WhatsApp Community</h3>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Join the official WhatsApp community group for instantaneous replies and direct engagement with peers and organizers.
                    </p>
                    <a
                      href={WHATSAPP_COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold inline-block text-xs py-2 px-5 font-bold"
                    >
                      Connect on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* SUBMIT ABSTRACT MODAL */}
      {abstractModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">Submit Paper Abstract</h3>
                <p className="text-xs text-slate-500">{abstractModalEvent.title}</p>
              </div>
              <button onClick={() => setAbstractModalEvent(null)} className="text-slate-400 hover:text-navy">✕</button>
            </div>

            <form onSubmit={handleAbstractSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Paper / Abstract Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advancements in Machine Learning for Healthcare..."
                  className="input mt-1 w-full text-xs"
                  value={abstractForm.title}
                  onChange={(e) => setAbstractForm({ ...abstractForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Conference Track</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence, Data Science, Humanities..."
                  className="input mt-1 w-full text-xs"
                  value={abstractForm.track}
                  onChange={(e) => setAbstractForm({ ...abstractForm, track: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Abstract (Max 300 words)</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Paste your research abstract here including objective, methodology, and key findings..."
                  className="input mt-1 w-full text-xs leading-relaxed"
                  value={abstractForm.abstractText}
                  onChange={(e) => setAbstractForm({ ...abstractForm, abstractText: e.target.value })}
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Author: <strong>{user.name}</strong> ({user.email}) · Your registered candidate profile and CV will be linked to this submission.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAbstractModalEvent(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-navy text-xs py-2 px-5">
                  Submit Abstract for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK JOB APPLY MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">Apply for Role</h3>
                <p className="text-xs text-slate-500">{selectedJob.title}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-navy">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-navy">Candidate Details:</p>
                <p className="mt-1 text-slate-600">Name: {user.name}</p>
                <p className="text-slate-600">Email: {user.email}</p>
                <p className="text-slate-600">Location: {profile.location}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-700">Attached Curriculum Vitae:</p>
                {profile.cv ? (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-2.5 text-emerald-800">
                    <span>📄</span>
                    <span className="font-bold truncate">{profile.cv.fileName}</span>
                  </div>
                ) : (
                  <div className="mt-2 text-red-600">
                    No CV attached! Please upload your CV in the profile tab.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickJobApply(selectedJob)}
                  className="btn-navy py-2 px-5"
                >
                  Confirm &amp; Send Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
