const paradoxCompetitions = [
  {
    _id: "1",
    title: "Capture The Flag",
    tagline: "Think. Hack. Solve. Repeat.",
    description: "Operation Code Heist is an inter-collegiate cybersecurity competition built around a cyber-heist theme. Teams navigate six rounds, racing to crack the heist on a live scoring leaderboard.",
    date: "2026-09-17T05:00:00Z",
    location: "Main Auditorium",
    teamSize: "3–4 members",
    slug: "capture-the-flag",
    poster: "/ctf-img.webp",
    imageUrl: "/ctf-img.webp",
    prize: 10000,
    registrationCost: { ieee: 250, nonIeee: 300 },
    rules: [
      "Teams of 4; two structured 3-hour sessions with a lunch break in between (total event duration 8.5 hours).",
      "Levels unlock sequentially - a level becomes accessible only after the previous one is solved. No separate time limit per level, only the overall event duration.",
      "No flag-sharing between teams, and no attacking other teams' systems or the competition infrastructure - testing is authorised only within the provided environment.",
      "Standard cybersecurity tools and public documentation are permitted (e.g. Wireshark, Burp Suite, Ghidra, CyberChef, Hydra, Nmap - full suggested list shared at the briefing).",
      "Flags must be submitted through the official CTF platform before the scheduled end time - no extensions will be given.",
      "Final rankings are based on the official leaderboard: flags solved and time taken. Organisers/judges' decisions on violations and scoring are final."
    ]
  },
  {
    _id: "2",
    title: "Tech Auction",
    tagline: "Bid. Strategize. Win.",
    description: "Tech Auction is a team-based technical strategy event that combines bidding, decision-making, and innovation. Teams start with a fixed amount of virtual currency (CHIPS) and bid for technologies - AI systems, frameworks, databases, hardware, and more. After the auction, teams must build a working prototype using only the technologies they've acquired, based on a problem statement revealed before bidding begins.",
    date: "2026-09-18T05:00:00Z",
    location: "IT Block Edusat Hall",
    teamSize: "3–4 members",
    slug: "tech-auction",
    poster: "/tech-img.webp",
    imageUrl: "/tech-img.webp",
    prize: 6000,
    registrationCost: { ieee: 200, nonIeee: 250 },
    rules: [
      "Every team starts with an equal amount of CHIPS - no borrowing or transferring CHIPS between teams.",
      "A team may bid only if it has sufficient CHIPS; only two teams can be in a bidding war at once.",
      "Once a bid is accepted, it cannot be withdrawn. No communication with other teams during active bidding.",
      "The auctioneer's decision on bid validity is final.",
      "The final solution must meaningfully use the technologies acquired during the auction.",
      "AI/vibe-coding tools (ChatGPT, Gemini, Claude, Perplexity, or others) are allowed while building.",
      "No plagiarism and no pre-built/previously developed projects as the final submission.",
      "Only registered team members may work on the solution; no outside technical assistance."
    ]
  },
  {
    _id: "3",
    title: "AI Film Making",
    tagline: "Ideas · AI · Stories · Beyond reality",
    description: "The AI Film Making Challenge is a creative event where teams use Artificial Intelligence tools to script, generate, and edit a short film based on a theme revealed only after the event begins - so every team starts on equal footing. The event is presented in association with Who VR and is designed to test creativity, storytelling, teamwork, and effective use of AI tools under time pressure.",
    date: "2026-09-18T05:00:00Z",
    location: "IT Block",
    teamSize: "1–2 members",
    slug: "ai-film-making",
    poster: "/ai-img.webp",
    imageUrl: "/ai-img.webp",
    prize: 4000,
    registrationCost: { all: 100 },
    rules: [
      "Teams of 1-2 participants each.",
      "The theme is revealed only after the event starts - no pre-made or pre-prepared footage related to the theme may be used.",
      "Teams get a 2-hour window to script, generate, and edit their film using AI and/or conventional tools.",
      "Final films must be submitted within the given submission window (10-20 minutes); late submissions may be penalised or disqualified.",
      "The submission must be an original piece of work created during the event - no plagiarism or reuse of pre-existing content.",
      "Content must not be obscene, anti-religious, anti-national, or discriminatory in any way; violations lead to immediate disqualification.",
      "Judged on creativity & originality, interpretation of theme, storytelling, execution, and overall impact."
    ]
  }
];

export const PARADOX_SLUG = "paradox-2026";

export const sharedEvents = [
  {
    _id: "skill-up-bootcamp-2026",
    title: "Skill Up Boot Camp",
    tagline: "A 4-day hands-on tech bootcamp.",
    eyebrow: "Bootcamp",
    description:
      "Skill Up Boot Camp is a 4-day, hands-on technical bootcamp organized by AdroIT at RNS Institute of Technology to help students move beyond theory and gain practical exposure to industry-relevant technologies.",
    about: [
      "From October 6 to October 9, 2026, each day focuses on a different technology domain.",
      "Day 1 - Data Analytics: Explore how raw data is processed, analyzed, and transformed into meaningful insights using practical tools and real-world datasets.",
      "Day 2 - Cloud Computing: Learn the fundamentals of cloud infrastructure and get hands-on experience with deployment, cloud services, and building scalable applications.",
      "Day 3 - Machine Learning: Understand the foundations of machine learning and work through the process of preparing data, building models, and applying ML to practical problems.",
      "Day 4 - Cybersecurity: Learn essential cybersecurity concepts, common vulnerabilities, security practices, and how modern systems can be protected against threats.",
      "Learn. Build. Experiment.",
      "The bootcamp is designed around learning by doing. Instead of spending the entire session listening to presentations, participants work with tools, technologies, demonstrations, and practical activities that help turn concepts into actual skills.",
      "Whether you are just beginning your journey or already exploring these domains, Skill Up Boot Camp gives you an opportunity to discover new technologies, build practical understanding, and experience how different areas of technology are used in real-world applications.",
      "4 Days. 4 Domains. One hands-on experience.",
    ],
    date: "2026-10-06T05:00:00Z",
    endDate: "2026-10-09T05:00:00Z",
    dateLabel: "October 6–9, 2026",
    slug: "skill-up-bootcamp",
    status: "upcoming",
    registration: "individual",
    poster: "/skill-up-bootcamp.webp",
    imageUrl: "/skill-up-bootcamp.webp",
    posterFit: "contain",
    sessions: [
      {
        day: "October 6",
        title: "Data Analytics",
        slug: "data-analytics",
        topics: [
          "Introduction to Data Analytics & Power BI",
          "Explore & Clean Real-World College Data",
          "Build Interactive Dashboards",
          "Analyze Campus Footfall & Student Preferences",
          "Make a Data-Driven Business Decision",
          "Mini Challenge: Where Should the Next Campus Stall Be?",
        ],
      },
      {
        day: "October 7",
        title: "Cloud Computing",
        slug: "cloud-computing",
        topics: [
          "Introduction to Cloud Computing",
          "Deployment Practical",
          "AWS Services",
          "System Design with Real-World Example",
          "Mini Game",
        ],
      },
      { day: "October 8", title: "Machine Learning", slug: "machine-learning" },
      { day: "October 9", title: "Cybersecurity", slug: "cybersecurity" },
    ],
  },
  {
    _id: "paradox-2026",
    title: "Paradox 2026",
    tagline: "Three competitions. Two days. One fest.",
    description: "Paradox 2026 was AdroIT's inter-collegiate technical fest at RNSIT — Capture The Flag, Tech Auction, and AI Film Making — held on 17–18 September 2026.",
    date: "2026-09-17T05:00:00Z",
    endDate: "2026-09-18T05:00:00Z",
    location: "RNSIT",
    slug: PARADOX_SLUG,
    status: "completed",
    poster: "https://res.cloudinary.com/vkdnztnm/image/upload/v1791109091/Neon_Cyberpunk_Tech_Fest_Poster.webp",
    imageUrl: "https://res.cloudinary.com/vkdnztnm/image/upload/v1791109091/Neon_Cyberpunk_Tech_Fest_Poster.webp",
    posterFit: "contain",
    posterColumn: "30%",
    glimpses: [
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_0975.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_1258.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1326.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1317.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_1018.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1430.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_1236.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1475.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800796/IMG_1412.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1465.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1231.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1021.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_0972.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/f_auto,q_auto/IMG_1499",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1315.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1045.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1442.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1332.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_0985.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1324.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_1241.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800796/IMG_1355.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800796/IMG_1403.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1455.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_1275.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1203.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1480.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1436.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800792/IMG_1243.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1189.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1325.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800794/IMG_1316.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_1017.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1388.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_0996.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800797/IMG_1451.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800796/IMG_1422.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800793/IMG_1035.webp",
      "https://res.cloudinary.com/vkdnztnm/image/upload/v1790800795/IMG_1333.webp",
    ],
    competitions: paradoxCompetitions,
  },
  {
    _id: "internship-2026",
    title: "Internship Program",
    tagline: "One month of sessions for CSE students.",
    eyebrow: "Internship",
    description:
      "AdroIT conducted a one-month internship in July and August 2026 for CSE students from the 2028 and 2029 batches.",
    about: [
      "During July and August 2026, AdroIT conducted a one-month internship program for CSE students at RNS Institute of Technology. The program was open to students from the 2025 and 2026 batches, with structured technical learning and practical exposure across the month.",
      "The sessions were conducted by AdroIT club members, who planned, taught, and guided participants throughout the internship. Rather than a single workshop, it was a series of sessions across the month, so students could learn progressively and apply the work through hands-on activities.",
      "The program gave CSE students practical exposure to relevant technologies, development practices, and industry-oriented concepts, with AdroIT members as the instructors and mentors. It was not an internal program for AdroIT members. Club members conducted it for the wider CSE student community at RNSIT.",
    ],
    date: "2026-07-01T05:00:00Z",
    endDate: "2026-08-31T05:00:00Z",
    dateLabel: "July – August 2026",
    location: "RNSIT",
    slug: "internship-2026",
    status: "completed",
  },
];

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function istDayStartMs(iso) {
  const date = new Date(iso);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - IST_OFFSET_MS;
}

export function eventPhase(event, now = new Date()) {
  if (event.status === "completed") return "completed";
  if (event.status !== "upcoming" || !event.date) return "upcoming";
  const start = istDayStartMs(event.date);
  const end = istDayStartMs(event.endDate || event.date) + DAY_MS;
  const time = now.getTime();
  if (time < start) return "upcoming";
  if (time < end) return "live";
  return "completed";
}

const SEVEN_PM_MS = 19 * 60 * 60 * 1000;

export function sessionCompleted(event, index, now = new Date()) {
  if (!event?.date || index < 0) return false;
  const cutoff = istDayStartMs(event.date) + index * DAY_MS + SEVEN_PM_MS;
  return now.getTime() >= cutoff;
}

export function eventStatusLabel(event, now = new Date()) {
  const phase = eventPhase(event, now);
  if (phase === "live") return "Event live";
  if (phase === "upcoming") return "Upcoming";
  return "Completed";
}

export function partitionEvents(now = new Date()) {
  const upcoming = [];
  const completed = [];
  for (const event of sharedEvents) {
    if (eventPhase(event, now) === "completed") completed.push(event);
    else upcoming.push(event);
  }
  return { upcoming, completed };
}

export const upcomingEvents = sharedEvents.filter((event) => event.status === "upcoming");
export const completedEvents = sharedEvents.filter((event) => event.status === "completed");

export const getEventBySlug = (slug) => sharedEvents.find((event) => event.slug === slug);

export const findEditionForCompetitionSlug = (slug) =>
  sharedEvents.find((event) => event.competitions?.some((competition) => competition.slug === slug));
