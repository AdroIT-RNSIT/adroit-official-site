// Serverless functions can't import from frontend/src (it's an ES module package and
// these are bundled as CommonJS), so keep this in sync with the skill-up-bootcamp
// sessions in frontend/src/data/events.js and `closed` in domainRegistration.js.
export const BOOTCAMP_SESSIONS = [
  { slug: "data-analytics", title: "Data Analytics", day: "October 6", closed: true },
  { slug: "cloud-computing", title: "Cloud Computing", day: "October 7", closed: false },
  { slug: "machine-learning", title: "Machine Learning", day: "October 8", closed: false },
  { slug: "cybersecurity", title: "Cybersecurity", day: "October 9", closed: false },
];
