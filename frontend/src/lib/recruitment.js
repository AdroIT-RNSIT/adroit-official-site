import { registrationDomains } from "../data/domainRegistration";

export const RECRUITMENT_DOMAINS = registrationDomains
  .filter((d) => d.slug !== "non-tech")
  .map((d) => d.title);

export const RECRUITMENT_INFO = {
  dates: "November 12 & 13, 2026",
  time: "After 2:00 PM",
  venue: "Admin Block Seminar Hall (2nd Floor)",
};
