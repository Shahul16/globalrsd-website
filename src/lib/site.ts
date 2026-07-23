export const SITE = {
  name: "Global Institute of Research & Skills Development",
  shortName: "GIRSD",
  domain: "https://www.globalrsd.co.uk",
  domainDisplay: "www.globalrsd.co.uk",
  email: "info@globalrsd.co.uk",
  researchEmail: "research@globalrsd.co.uk",
  awardsEmail: "awards@globalrsd.co.uk",
  phone: "+44 7586 261118",
  whatsapp: "https://wa.me/447586261118",
  accreditation: "Approved CPD (Continuing Professional Development) provider",
  /**
   * Accreditation & statutory registrations shown as trust badges.
   * Fill in the real numbers once issued — leave "" to hide the number line.
   * Official logo artwork: drop the files supplied by each body into
   * /public/accreditations/{cpd,ico,ukrlp}.png and they replace the built-in
   * emblems automatically (see SETUP_GUIDE.md §8).
   */
  registrations: {
    cpd: { name: "CPD Provider", body: "The CPD Group / CPD Certification", number: "" },
    ico: { name: "ICO Registered", body: "Information Commissioner's Office (UK GDPR)", number: "" },
    ukrlp: { name: "UKRLP Registered", body: "UK Register of Learning Providers", number: "" }, // UKPRN
  },
  credit: { name: "Shahul Hameed", url: "https://www.linkedin.com/in/shahul-hameed16/" },
  companyLine:
    "Global Institute of Research & Skills Development (GIRSD) is a trading name of Q TECH PRIVATE LTD, registered in England & Wales (Company No. 15754767).",
  company: {
    legalName: "Q TECH PRIVATE LTD",
    number: "15754767",
    tradingAs: "Global Institute of Research & Skills Development (GIRSD)",
    address: "23 Kinnaird Avenue, Bromley BR1 4HG, England",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/globalrsd",
    instagram: "https://www.instagram.com/globalrsd",
    youtube: "https://www.youtube.com/globalrsd",
  },
  stats: {
    members: 25,
    conferences: 3,
    countries: 1,
    papers: 70,
  },
  memberDiscount: 0.3,
};
