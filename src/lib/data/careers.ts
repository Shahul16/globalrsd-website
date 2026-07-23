export type JobOpening = {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  location: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const openings: JobOpening[] = [
  {
    id: "conference-programme-coordinator",
    title: "Conference & Programme Coordinator",
    department: "Events",
    type: "Full-time",
    location: "London / Hybrid",
    salary: "£30,000 – £36,000 per year",
    summary:
      "Own the end-to-end delivery of our international conferences — from call-for-papers and speaker liaison to on-the-day operations and post-event reporting.",
    responsibilities: [
      "Coordinate conference logistics, venues, suppliers and delegate communications",
      "Manage the call-for-papers pipeline and review-committee scheduling",
      "Support speakers, session chairs and sponsors before and during events",
      "Track budgets, registrations and post-event evaluation metrics",
    ],
    requirements: [
      "2+ years in events, conference or programme coordination",
      "Excellent written English and stakeholder communication",
      "Comfortable with registration, CRM and spreadsheet tooling",
      "Right to work in the UK",
    ],
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Full-time",
    location: "Remote (UK)",
    salary: "£28,000 – £34,000 per year",
    summary:
      "Grow our conference, course and membership audiences across email, social and search — turning academic programmes into campaigns that fill rooms.",
    responsibilities: [
      "Plan and run multi-channel campaigns for conferences, courses and awards",
      "Own the email calendar, segmentation and performance reporting",
      "Produce and schedule content for LinkedIn, Instagram and YouTube",
      "Improve on-site conversion and SEO in collaboration with the web team",
    ],
    requirements: [
      "2+ years in digital marketing, ideally events or education",
      "Hands-on with email platforms, analytics and paid social",
      "Strong copywriting with an eye for academic/professional audiences",
    ],
  },
  {
    id: "research-programmes-officer",
    title: "Research Programmes Officer",
    department: "Academic",
    type: "Part-time",
    location: "Remote (UK)",
    salary: "£18,000 – £22,000 pro rata (£36,000 – £44,000 FTE equivalent)",
    summary:
      "Support the academic backbone of GIRSD — coordinating peer review, publication support and the research-writing masterclass series.",
    responsibilities: [
      "Coordinate reviewers and manage manuscript workflows",
      "Support authors through submission, revision and certification",
      "Assist in developing new research-skills workshops and masterclasses",
    ],
    requirements: [
      "Postgraduate degree or equivalent research experience",
      "Familiarity with academic publishing and referencing standards",
      "Organised, deadline-driven and detail-oriented",
    ],
  },
  {
    id: "business-development-manager",
    title: "Business Development Manager",
    department: "Business Development",
    type: "Full-time",
    location: "London / Hybrid",
    salary: "£38,000 – £48,000 per year, plus performance bonus",
    summary:
      "Drive sponsorship, partnership and institutional membership growth — building relationships with universities, corporates and professional bodies that expand GIRSD's reach.",
    responsibilities: [
      "Identify and close sponsorship deals for conferences and awards",
      "Build partnerships with universities, corporates and professional bodies",
      "Grow institutional and corporate membership accounts",
      "Represent GIRSD at industry events and manage key stakeholder relationships",
      "Report pipeline, forecasts and conversion metrics to leadership",
    ],
    requirements: [
      "3+ years in business development, partnerships or sponsorship sales",
      "Track record of closing B2B deals and managing a pipeline",
      "Confident communicator, comfortable presenting to senior stakeholders",
      "Experience in events, education or membership organisations is a plus",
      "Right to work in the UK",
    ],
  },
  {
    id: "associate-course-tutor",
    title: "Associate Course Tutor (Freelance)",
    department: "Education",
    type: "Freelance",
    location: "Remote (Worldwide)",
    salary: "£150 – £250 per delivered session, paid monthly",
    summary:
      "Deliver live online sessions and assess learner submissions on one of our certified CPD courses — data science, business analysis, cybersecurity, digital marketing or management.",
    responsibilities: [
      "Deliver scheduled live sessions and Q&A clinics",
      "Mark assessments and provide constructive learner feedback",
      "Keep course materials current with industry practice",
    ],
    requirements: [
      "Demonstrable professional expertise in the subject area",
      "Prior teaching, training or mentoring experience",
      "Reliable availability for scheduled cohort sessions",
    ],
  },
];
