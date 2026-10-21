import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeGithub,
  normalizePhone,
  normalizeUsn,
  normalizeWhatsappLink,
  parseFilters,
  validateRegistration,
  validateSettingsPatch,
} from "../api/_lib/recruitment-validate.js";
import { DEFAULT_SETTINGS } from "../api/_lib/recruitment-config.js";

const settings = structuredClone(DEFAULT_SETTINGS);

const base = {
  fullName: "  Asha   Rao ",
  usn: "1rn24cs001",
  branch: "CSE",
  academicYear: "SECOND_YEAR",
  semester: 3,
  section: "a",
  phoneNumber: "+91 98765 43210",
  githubProfile: "github.com/asha-rao",
  registrationType: "TECHNICAL",
  preferences: { first: "CLOUD", second: "ML_AI", third: "NON_TECH" },
};

test("normalizes USN, phone, name, section and GitHub", () => {
  const { value, errors } = validateRegistration(base, settings);
  assert.equal(errors, undefined);
  assert.equal(value.fullName, "Asha Rao");
  assert.equal(value.usn, "1RN24CS001");
  assert.equal(value.phoneNumber, "9876543210");
  assert.equal(value.section, "A");
  assert.equal(value.githubProfile, "https://github.com/asha-rao");
  assert.equal(value.branch, "CSE");
  assert.deepEqual(value.preferences, { first: "CLOUD", second: "ML_AI", third: "NON_TECH" });
});

test("normalizers handle common input shapes", () => {
  assert.equal(normalizeUsn(" 1rn-24cs 001 "), "1RN24CS001");
  assert.equal(normalizePhone("09876543210"), "9876543210");
  assert.equal(normalizePhone("919876543210"), "9876543210");
  assert.deepEqual(normalizeGithub(""), { ok: true, value: null });
  assert.deepEqual(normalizeGithub("https://www.github.com/octocat/"), { ok: true, value: "https://github.com/octocat" });
  assert.equal(normalizeGithub("https://gitlab.com/octocat").ok, false);
  assert.equal(normalizeGithub("https://github.com/octocat/repo").ok, false);
  assert.equal(normalizeGithub("javascript:alert(1)").ok, false);
});

test("rejects non-CSE branches, bad USNs and bad phones", () => {
  assert.ok(validateRegistration({ ...base, branch: "ECE" }, settings).errors.branch);
  assert.equal(validateRegistration({ ...base, usn: "rns24cse001" }, settings).value.usn, "RNS24CSE001");
  assert.equal(validateRegistration({ ...base, usn: "1RN23CS001" }, settings).value.usn, "1RN23CS001");
  assert.ok(validateRegistration({ ...base, usn: "ABCDEFG" }, settings).errors.usn);
  assert.ok(validateRegistration({ ...base, usn: "12345678" }, settings).errors.usn);
  assert.ok(validateRegistration({ ...base, usn: "1RN24" }, settings).errors.usn);
  assert.ok(validateRegistration({ ...base, usn: "1RN24CS001!" }, settings).errors.usn);
  assert.ok(validateRegistration({ ...base, phoneNumber: "1234567890" }, settings).errors.phoneNumber);
  assert.ok(validateRegistration({ ...base, phoneNumber: "98765" }, settings).errors.phoneNumber);
});

test("only semester 1 (first year) and semester 3 (second year) are accepted", () => {
  assert.equal(validateRegistration({ ...base, academicYear: "FIRST_YEAR", semester: 1 }, settings).errors, undefined);
  assert.equal(validateRegistration({ ...base, academicYear: "SECOND_YEAR", semester: 3 }, settings).errors, undefined);
  assert.ok(validateRegistration({ ...base, academicYear: "FIRST_YEAR", semester: 2 }, settings).errors.semester);
  assert.ok(validateRegistration({ ...base, academicYear: "SECOND_YEAR", semester: 4 }, settings).errors.semester);
  assert.ok(validateRegistration({ ...base, academicYear: "FIRST_YEAR", semester: 3 }, settings).errors.semester);
  assert.ok(validateRegistration({ ...base, academicYear: "THIRD_YEAR", semester: 5 }, settings).errors.academicYear);
});

test("section is a single typed letter", () => {
  assert.equal(validateRegistration({ ...base, section: "z" }, settings).value.section, "Z");
  assert.ok(validateRegistration({ ...base, section: "AB" }, settings).errors.section);
  assert.ok(validateRegistration({ ...base, section: "1" }, settings).errors.section);
  assert.ok(validateRegistration({ ...base, section: "" }, settings).errors.section);
});

test("GitHub link is optional but must be valid when given", () => {
  assert.equal(validateRegistration({ ...base, githubProfile: "" }, settings).value.githubProfile, null);
  assert.ok(validateRegistration({ ...base, githubProfile: "https://gitlab.com/x" }, settings).errors.githubProfile);
});

test("technical route needs two distinct technical preferences", () => {
  const v = (preferences) => validateRegistration({ ...base, preferences }, settings).errors;
  assert.ok(v({ first: "CLOUD", second: "CLOUD" }).second);
  assert.ok(v({ first: "CLOUD" }).second);
  assert.ok(v({ second: "CLOUD" }).first);
  assert.ok(v({ first: "NON_TECH", second: "CLOUD" }).first);
  assert.ok(v({ first: "CLOUD", second: "NON_TECH" }).second);
  assert.ok(v({ first: "CLOUD", second: "ML_AI", third: "CYBERSECURITY" }).third);
  assert.ok(v({ first: "CLOUD", second: "ML_AI", extra: "x" }).preferences);
  assert.equal(v({ first: "CYBERSECURITY", second: "DATA_ANALYTICS", third: null }), undefined);
});

test("non-tech-only route stores no technical preferences", () => {
  const ok = validateRegistration({ ...base, registrationType: "NON_TECH_ONLY", preferences: undefined }, settings);
  assert.equal(ok.errors, undefined);
  assert.deepEqual(ok.value.preferences, { first: null, second: null, third: null });
  assert.ok(validateRegistration({ ...base, registrationType: "NON_TECH_ONLY" }, settings).errors.preferences);
});

test("unexpected properties and unknown types are rejected", () => {
  assert.ok(validateRegistration({ ...base, status: "WITHDRAWN" }, settings).errors.form);
  assert.ok(validateRegistration({ ...base, registrationId: "AR26-AAAAAA" }, settings).errors.form);
  assert.ok(validateRegistration({ ...base, registrationType: "ADMIN" }, settings).errors.registrationType);
  assert.ok(validateRegistration(null, settings).errors.form);
});

test("settings: end must follow start, domains must stay complete", () => {
  const start = "2026-11-01T09:00:00+05:30";
  assert.ok(validateSettingsPatch({ registrationStartAt: start, registrationEndAt: "2026-10-01T09:00:00+05:30" }, settings).errors.registrationEndAt);
  assert.equal(validateSettingsPatch({ registrationStartAt: start, registrationEndAt: "2026-11-10T17:00:00+05:30" }, settings).errors, undefined);
  assert.ok(validateSettingsPatch({ domains: settings.domains.slice(1) }, settings).errors.domains);
  assert.ok(validateSettingsPatch({ updatedBy: "me" }, settings).errors.form);
  assert.ok(validateSettingsPatch({ registrationOpen: "yes" }, settings).errors.registrationOpen);
  assert.ok(validateSettingsPatch({ sections: ["A", "A"] }, settings).errors.sections);
  assert.deepEqual(validateSettingsPatch({ sections: ["a", "b1"] }, settings).value.sections, ["A", "B1"]);
});

test("WhatsApp link must be a chat.whatsapp.com group invite", () => {
  assert.equal(normalizeWhatsappLink(""), "");
  assert.equal(normalizeWhatsappLink(" chat.whatsapp.com/EadapPb17111goHGOtWCEK/ "), "https://chat.whatsapp.com/EadapPb17111goHGOtWCEK");
  assert.equal(normalizeWhatsappLink("https://chat.whatsapp.com/EadapPb17111goHGOtWCEK?mode=ac"), "https://chat.whatsapp.com/EadapPb17111goHGOtWCEK");
  assert.equal(normalizeWhatsappLink("https://wa.me/919876543210"), null);
  assert.equal(normalizeWhatsappLink("https://evil.example/chat.whatsapp.com/abc"), null);
  assert.equal(normalizeWhatsappLink("javascript:alert(1)"), null);
  assert.ok(validateSettingsPatch({ whatsappLink: "https://example.com" }, settings).errors.whatsappLink);
  assert.equal(validateSettingsPatch({ whatsappLink: "https://chat.whatsapp.com/EadapPb17111goHGOtWCEK" }, settings).value.whatsappLink, "https://chat.whatsapp.com/EadapPb17111goHGOtWCEK");
});

test("filters are whitelisted", () => {
  assert.ok(parseFilters(new URLSearchParams("type=ADMIN")).errors.type);
  assert.ok(parseFilters(new URLSearchParams("sort=password")).errors.sort);
  assert.ok(parseFilters(new URLSearchParams("from=2026-10-10&to=2026-10-01")).errors.to);
  assert.equal(parseFilters(new URLSearchParams("domain=CLOUD&third=NON_TECH&pageSize=50")).value.pageSize, 50);
});
