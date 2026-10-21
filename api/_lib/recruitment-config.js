// Central recruitment configuration. Domain ids are stored on every registration, so never rename
// an id once registrations exist; names, descriptions and targets are editable in admin69 settings.
// Keep the year/semester rules in sync with frontend/src/lib/recruitment.js.

export const NON_TECH = "NON_TECH";

export const DOMAINS = [
  {
    id: "CLOUD",
    name: "Cloud Computing",
    technical: true,
    description: "Design and deploy scalable applications on AWS, Azure and GCP. Learn Docker, Kubernetes and DevOps.",
  },
  {
    id: "ML_AI",
    name: "Machine Learning / AI",
    technical: true,
    description: "Build intelligent systems that learn from data: neural networks, computer vision and NLP.",
  },
  {
    id: "CYBERSECURITY",
    name: "Cybersecurity",
    technical: true,
    description: "Protect systems from threats. Ethical hacking, network security, CTFs and cryptography.",
  },
  {
    id: "DATA_ANALYTICS",
    name: "Data Analytics",
    technical: true,
    description: "Turn raw data into insight with SQL, Python, visualisation and business intelligence.",
  },
  {
    id: NON_TECH,
    name: "Non-Tech",
    technical: false,
    description: "Events, design, social media, content, marketing and outreach that keep the club visible and moving.",
  },
];

export const DOMAIN_IDS = DOMAINS.map((d) => d.id);
export const TECH_DOMAIN_IDS = DOMAINS.filter((d) => d.technical).map((d) => d.id);

export const YEARS = {
  FIRST_YEAR: { label: "First Year", semesters: [1] },
  SECOND_YEAR: { label: "Second Year", semesters: [3] },
};
export const YEAR_IDS = Object.keys(YEARS);

export const REGISTRATION_TYPES = ["TECHNICAL", "NON_TECH_ONLY"];
export const STATUSES = ["REGISTERED", "WITHDRAWN"];
export const BRANCH = "CSE";
export const TIME_ZONE = "Asia/Kolkata";

export const DEFAULT_SETTINGS = {
  recruitmentName: "AdroIT Recruitment",
  registrationOpen: false,
  registrationStartAt: null,
  registrationEndAt: null,
  recruitmentDate: null,
  recruitmentTime: "",
  recruitmentVenue: "",
  announcement:
    "AdroIT is recruiting first- and second-year CSE students. Pick the domains you genuinely want to work in.",
  instructions: [
    "Pick the domains you want: two technical domains in order of preference, plus Non-Tech if you like.",
    "Only interested in Non-Tech? Pick just Non-Tech.",
    "You can register once. Contact the AdroIT team if your details need correcting.",
  ],
  nextSteps: "Keep an eye on the WhatsApp group for the recruitment schedule and updates.",
  // Shown only to students who have just registered (in the register response), never in the public config.
  whatsappLink: "",
  allowedYears: YEAR_IDS,
  allowedBranch: BRANCH,
  sections: ["A", "B", "C", "D"],
  domains: DOMAINS.map(({ id, name, description }) => ({ id, name, description, target: 0 })),
};
