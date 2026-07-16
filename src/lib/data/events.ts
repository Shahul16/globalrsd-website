export type TicketTier = {
  id: string;
  name: string;
  price: number; // GBP
  includes: string[];
};

export type AgendaItem = { time: string; title: string; speaker?: string };

export type Speaker = {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
};

export type Event = {
  slug: string;
  category: "Research Conferences" | "Skills Development Workshops" | "Global Education";
  title: string;
  acronym: string;
  date: string; // ISO
  endDate: string;
  venue: string;
  city: string;
  summary: string;
  description: string;
  themes: string[];
  tickets: TicketTier[];
  agenda: { day: string; items: AgendaItem[] }[];
  speakers: Speaker[];
};

export const events: Event[] = [
  {
    slug: "icriet-2026",
    category: "Research Conferences",
    title: "International Conference on Research Innovation in Engineering & Technology",
    acronym: "ICRIET 2026",
    date: "2026-10-15T09:00:00Z",
    endDate: "2026-10-16T17:00:00Z",
    venue: "The Bromley Court Hotel",
    city: "London, United Kingdom",
    summary:
      "GIRSD's flagship two-day conference bringing together researchers, industry engineers and doctoral candidates to present peer-reviewed work across engineering and emerging technology.",
    description:
      "ICRIET 2026 is the seventh edition of GIRSD's flagship research conference. Accepted papers undergo double-blind peer review by our international scientific committee, and selected papers are recommended for publication in partner journals indexed in Scopus and Web of Science. The programme combines keynote addresses, parallel technical sessions, a doctoral symposium and a poster exhibition, with structured networking sessions on both days.",
    themes: [
      "Artificial intelligence and machine learning applications",
      "Renewable energy systems and sustainable engineering",
      "Advanced materials and manufacturing",
      "Robotics, automation and control systems",
      "Data science, IoT and cyber-physical security",
    ],
    tickets: [
      { id: "icriet-virtual", name: "Virtual Delegate", price: 99, includes: ["Live-stream access to all sessions", "Digital proceedings", "e-Certificate of participation"] },
      { id: "icriet-delegate", name: "Delegate (In-person)", price: 249, includes: ["Full two-day access", "Lunch and refreshments", "Printed proceedings", "Certificate of participation"] },
      { id: "icriet-presenter", name: "Author / Presenter", price: 349, includes: ["Paper presentation slot", "Publication recommendation", "Full delegate benefits", "Best Paper Award eligibility"] },
    ],
    agenda: [
      {
        day: "Day 1 — Thursday 15 October 2026",
        items: [
          { time: "08:30", title: "Registration and welcome refreshments" },
          { time: "09:15", title: "Opening address", speaker: "Dr Amelia Hartwell, Conference Chair" },
          { time: "09:45", title: "Keynote: Engineering in the Age of Foundation Models", speaker: "Prof. David Okonkwo" },
          { time: "11:00", title: "Parallel Session A — AI & Machine Learning" },
          { time: "11:00", title: "Parallel Session B — Sustainable Energy" },
          { time: "13:00", title: "Networking lunch" },
          { time: "14:00", title: "Doctoral symposium" },
          { time: "16:30", title: "Poster session and day-one close" },
        ],
      },
      {
        day: "Day 2 — Friday 16 October 2026",
        items: [
          { time: "09:00", title: "Keynote: Materials for a Net-Zero Economy", speaker: "Prof. Ingrid Svensson" },
          { time: "10:15", title: "Parallel Session C — Advanced Manufacturing" },
          { time: "10:15", title: "Parallel Session D — IoT & Security" },
          { time: "13:00", title: "Lunch" },
          { time: "14:00", title: "Industry panel: From Publication to Product" },
          { time: "15:30", title: "Best Paper Awards and closing ceremony" },
        ],
      },
    ],
    speakers: [
      { name: "Prof. David Okonkwo", title: "Professor of Intelligent Systems", affiliation: "University of Manchester", bio: "Leads a 30-strong research group on applied machine learning in engineering design, with over 180 publications and advisory roles with UKRI." },
      { name: "Prof. Ingrid Svensson", title: "Chair in Materials Science", affiliation: "KTH Royal Institute of Technology", bio: "Internationally recognised for research on low-carbon structural materials; coordinator of two Horizon Europe consortia." },
      { name: "Dr Amelia Hartwell", title: "Conference Chair", affiliation: "GIRSD Scientific Committee", bio: "Chartered engineer and research strategist who has chaired GIRSD's engineering conference series since 2022." },
    ],
  },
  {
    slug: "icash-2026",
    category: "Research Conferences",
    title: "International Conference on Applied Sciences & Humanities",
    acronym: "ICASH 2026",
    date: "2026-12-05T09:00:00Z",
    endDate: "2026-12-05T18:00:00Z",
    venue: "Manchester Conference Centre",
    city: "Manchester, United Kingdom",
    summary:
      "A one-day multidisciplinary conference connecting applied sciences with the humanities and social sciences, welcoming empirical, theoretical and practice-based contributions.",
    description:
      "ICASH 2026 provides a platform for cross-disciplinary dialogue. The conference welcomes research in education, psychology, business, linguistics, public health and the applied sciences. All accepted abstracts are published in the conference proceedings with an ISBN, and full papers may be submitted to affiliated open-access journals. Early-career researchers benefit from a dedicated mentoring clinic during the lunch interval.",
    themes: [
      "Education, pedagogy and digital learning",
      "Business, management and behavioural economics",
      "Public health and wellbeing",
      "Language, culture and communication",
      "Interdisciplinary research methods",
    ],
    tickets: [
      { id: "icash-virtual", name: "Virtual Delegate", price: 99, includes: ["Live-stream access", "Digital abstract book", "e-Certificate"] },
      { id: "icash-delegate", name: "Delegate (In-person)", price: 199, includes: ["Full-day access", "Lunch and refreshments", "Certificate of participation"] },
      { id: "icash-presenter", name: "Author / Presenter", price: 299, includes: ["Oral or poster presentation", "Proceedings publication", "Full delegate benefits"] },
    ],
    agenda: [
      {
        day: "Saturday 5 December 2026",
        items: [
          { time: "08:45", title: "Registration" },
          { time: "09:30", title: "Keynote: Evidence and Empathy — Research that Changes Practice", speaker: "Prof. Sarah McAllister" },
          { time: "10:45", title: "Session 1 — Education and Digital Learning" },
          { time: "12:30", title: "Lunch and early-career mentoring clinic" },
          { time: "13:30", title: "Session 2 — Health, Business and Society" },
          { time: "15:30", title: "Poster walk" },
          { time: "16:30", title: "Awards and closing remarks" },
        ],
      },
    ],
    speakers: [
      { name: "Prof. Sarah McAllister", title: "Professor of Education Policy", affiliation: "University of Edinburgh", bio: "Researches evidence-informed teaching practice and advises national curriculum bodies across the UK and Ireland." },
      { name: "Dr Rajan Mehta", title: "Reader in Health Economics", affiliation: "King's College London", bio: "Specialist in the economics of preventative healthcare with extensive NHS collaboration experience." },
    ],
  },
  {
    slug: "research-writing-masterclass-2026",
    category: "Skills Development Workshops",
    title: "Academic Writing & Publication Masterclass",
    acronym: "AWPM 2026",
    date: "2026-09-12T09:30:00Z",
    endDate: "2026-09-12T16:30:00Z",
    venue: "GIRSD Training Suite, Bromley",
    city: "London, United Kingdom",
    summary:
      "An intensive one-day workshop taking researchers from manuscript structure to journal submission, led by experienced journal editors and peer reviewers.",
    description:
      "This hands-on masterclass is limited to 30 participants to guarantee individual feedback. Participants work on their own draft manuscripts through structured exercises covering argument construction, literature positioning, responding to reviewers, and avoiding common desk-rejection triggers. Every attendee leaves with a personalised submission plan and three months of email follow-up support from the facilitation team.",
    themes: [
      "Structuring a publishable manuscript",
      "Selecting and targeting the right journal",
      "Navigating peer review and revisions",
      "Research integrity and authorship ethics",
    ],
    tickets: [
      { id: "awpm-standard", name: "Workshop Place", price: 149, includes: ["Full-day facilitated workshop", "Workbook and templates", "3 months email support", "Certificate of completion"] },
      { id: "awpm-premium", name: "Workshop + 1:1 Review", price: 249, includes: ["All workshop benefits", "60-minute one-to-one manuscript review", "Priority booking for future workshops"] },
    ],
    agenda: [
      {
        day: "Saturday 12 September 2026",
        items: [
          { time: "09:30", title: "Welcome and diagnostic exercise" },
          { time: "10:00", title: "Module 1 — Architecture of a strong paper" },
          { time: "11:30", title: "Module 2 — Journal selection and cover letters" },
          { time: "13:00", title: "Lunch" },
          { time: "13:45", title: "Module 3 — Surviving peer review" },
          { time: "15:15", title: "Module 4 — Personal submission plans" },
          { time: "16:15", title: "Certificates and close" },
        ],
      },
    ],
    speakers: [
      { name: "Dr Helen Ford", title: "Associate Editor", affiliation: "Journal of Applied Research Practice", bio: "Has handled over 1,200 manuscript submissions as an editor and teaches publication skills at doctoral training centres across the UK." },
    ],
  },
  {
    slug: "global-education-summit-2027",
    category: "Global Education",
    title: "Global Education & International Mobility Summit",
    acronym: "GEIMS 2027",
    date: "2027-02-20T09:00:00Z",
    endDate: "2027-02-21T17:00:00Z",
    venue: "Hilton Birmingham Metropole",
    city: "Birmingham, United Kingdom",
    summary:
      "A two-day summit for universities, pathway providers and education agents on transnational education, student mobility and international partnerships.",
    description:
      "GEIMS 2027 convenes international office leaders, admissions professionals, education agents and policy specialists. The summit features country-spotlight briefings, a partnership exchange where institutions meet prospective collaborators in curated one-to-one meetings, and practical sessions on compliance, agent management and student experience. An optional exhibitor package is available for institutions and service providers.",
    themes: [
      "Transnational education partnerships",
      "Student recruitment and ethical agent management",
      "UK visa and compliance updates",
      "Scholarship and funding pathways",
    ],
    tickets: [
      { id: "geims-delegate", name: "Delegate", price: 299, includes: ["Two-day summit access", "Partnership exchange meetings", "Lunches and evening reception", "Certificate of attendance"] },
      { id: "geims-exhibitor", name: "Exhibitor Package", price: 399, includes: ["Exhibition stand (2 days)", "Two delegate passes", "Logo in summit programme", "Delegate list (opt-in contacts)"] },
    ],
    agenda: [
      {
        day: "Day 1 — Saturday 20 February 2027",
        items: [
          { time: "09:00", title: "Registration and exhibition opens" },
          { time: "10:00", title: "Opening keynote: The Next Decade of Student Mobility", speaker: "Prof. Elena Vasquez" },
          { time: "11:30", title: "Country spotlights: South Asia and MENA" },
          { time: "14:00", title: "Partnership exchange — curated 1:1 meetings" },
          { time: "18:00", title: "Evening networking reception" },
        ],
      },
      {
        day: "Day 2 — Sunday 21 February 2027",
        items: [
          { time: "09:30", title: "Compliance briefing: UK sponsorship and agent regulation" },
          { time: "11:00", title: "Panel: Ethical recruitment in practice" },
          { time: "13:30", title: "Workshops: scholarships, articulation and TNE models" },
          { time: "16:00", title: "Closing plenary" },
        ],
      },
    ],
    speakers: [
      { name: "Prof. Elena Vasquez", title: "Pro Vice-Chancellor (International)", affiliation: "Aston University", bio: "Leads international strategy for a university community of 20,000 students and has built TNE partnerships across four continents." },
    ],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function nextEvent(now = new Date()) {
  return [...events]
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? events[0];
}
