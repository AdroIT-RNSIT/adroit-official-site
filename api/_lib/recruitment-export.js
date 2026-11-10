import { NON_TECH, TECH_DOMAIN_IDS, TIME_ZONE, YEARS } from "./recruitment-config.js";
import { filtersToQuery, parseFilters } from "./recruitment-validate.js";

const TYPE_LABEL = { TECHNICAL: "Technical", NON_TECH_ONLY: "Non-Tech only" };

const active = { status: "REGISTERED" };

/**
 * Turns the report parameters into a MongoDB query plus labels. Every report except "all" and
 * "filtered" covers active (REGISTERED) records only. Returns null for unknown or malformed input.
 */
export function resolveReport(params, settings) {
  const report = params.get("report") || "";
  const domain = params.get("domain") || "";
  const domainName = (id) => settings.domains.find((d) => d.id === id)?.name || id;
  const needsDomain = ["domain", "first-preference", "second-preference"].includes(report);
  if (needsDomain && !TECH_DOMAIN_IDS.includes(domain)) return null;

  switch (report) {
    case "all":
      return { slug: "All_Registrations", title: "All registrations", filters: ["Every registration, including withdrawn"], query: {} };
    case "technical":
      return { slug: "Technical", title: "Technical registrations", filters: ["Type: Technical", "Status: Registered"], query: { ...active, registrationType: "TECHNICAL" } };
    case "non-tech-only":
      return { slug: "NonTech_Only", title: "Non-Tech only registrations", filters: ["Type: Non-Tech only", "Status: Registered"], query: { ...active, registrationType: "NON_TECH_ONLY" } };
    case "first-year":
      return { slug: "First_Year", title: "First-year registrations", filters: ["Year: First Year", "Status: Registered"], query: { ...active, academicYear: "FIRST_YEAR" } };
    case "second-year":
      return { slug: "Second_Year", title: "Second-year registrations", filters: ["Year: Second Year", "Status: Registered"], query: { ...active, academicYear: "SECOND_YEAR" } };
    case "domain":
      return {
        slug: `${domainName(domain).replace(/[^A-Za-z0-9]+/g, "_")}_Applicants`,
        title: `${domainName(domain)} applicants`,
        filters: [`${domainName(domain)} as first or second preference`, "Type: Technical", "Status: Registered"],
        query: { ...active, registrationType: "TECHNICAL", $or: [{ "preferences.first": domain }, { "preferences.second": domain }] },
      };
    case "first-preference":
      return {
        slug: `${domainName(domain).replace(/[^A-Za-z0-9]+/g, "_")}_First_Preference`,
        title: `${domainName(domain)}: first preference`,
        filters: [`First preference: ${domainName(domain)}`, "Type: Technical", "Status: Registered"],
        query: { ...active, registrationType: "TECHNICAL", "preferences.first": domain },
      };
    case "second-preference":
      return {
        slug: `${domainName(domain).replace(/[^A-Za-z0-9]+/g, "_")}_Second_Preference`,
        title: `${domainName(domain)}: second preference`,
        filters: [`Second preference: ${domainName(domain)}`, "Type: Technical", "Status: Registered"],
        query: { ...active, registrationType: "TECHNICAL", "preferences.second": domain },
      };
    case "non-tech-optional":
      return {
        slug: "NonTech_Optional_Third",
        title: "Non-Tech as optional third preference",
        filters: ["Type: Technical", "Third preference: Non-Tech", "Status: Registered"],
        query: { ...active, registrationType: "TECHNICAL", "preferences.third": NON_TECH },
      };
    case "filtered": {
      const parsed = parseFilters(params);
      if (parsed.errors) return null;
      const f = parsed.value.filters;
      const labels = [];
      if (f.q) labels.push(`Search: "${f.q}"`);
      if (f.type) labels.push(`Type: ${TYPE_LABEL[f.type]}`);
      if (f.year) labels.push(`Year: ${YEARS[f.year].label}`);
      if (f.semester) labels.push(`Semester: ${f.semester}`);
      if (f.section) labels.push(`Section: ${f.section}`);
      if (f.domain) labels.push(f.domain === NON_TECH ? `Interested in ${domainName(f.domain)} (either route)` : `${domainName(f.domain)} as 1st or 2nd preference`);
      if (f.first) labels.push(`First preference: ${domainName(f.first)}`);
      if (f.second) labels.push(`Second preference: ${domainName(f.second)}`);
      if (f.third) labels.push(f.third === "NON_TECH" ? "Third preference: Non-Tech" : "No third preference");
      if (f.status) labels.push(`Status: ${f.status === "REGISTERED" ? "Registered" : "Withdrawn"}`);
      if (f.from) labels.push(`From: ${f.from}`);
      if (f.to) labels.push(`To: ${f.to}`);
      return {
        slug: "Filtered_Registrations",
        title: "Filtered registrations",
        filters: labels.length ? labels : ["No filters (every registration)"],
        query: filtersToQuery(f),
        sort: { [parsed.value.sort]: parsed.value.dir === "asc" ? 1 : -1, _id: 1 },
      };
    }
    default:
      return null;
  }
}

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

export function exportFilename(slug, now = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
  return `AdroIT_${slug.replace(/[^A-Za-z0-9_]/g, "")}_${day}.docx`;
}

function preferenceText(r, domainName) {
  if (r.registrationType === "NON_TECH_ONLY") return "Non-Tech only";
  const parts = [`1. ${domainName(r.preferences.first)}`, `2. ${domainName(r.preferences.second)}`];
  if (r.preferences.third) parts.push(`3. ${domainName(r.preferences.third)}`);
  return parts.join("\n");
}

/** Builds the .docx in memory. `docx` is imported lazily so public endpoints don't pay for it. */
export async function buildDocx(report, rows, settings, now = new Date()) {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    PageNumber,
    PageOrientation,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
  } = await import("docx");

  const domainName = (id) => settings.domains.find((d) => d.id === id)?.name || id || "";
  const font = "Calibri";
  const text = (value, opts = {}) =>
    String(value ?? "")
      .split("\n")
      .map((line, i) => new TextRun({ text: line, font, size: opts.size || 18, bold: opts.bold, break: i ? 1 : 0, color: opts.color }));

  const columns = [
    { label: "Sl. No.", width: 5, value: (_r, i) => i + 1 },
    { label: "Name", width: 14, value: (r) => r.fullName },
    { label: "USN", width: 10, value: (r) => r.usn },
    { label: "Year", width: 7, value: (r) => YEARS[r.academicYear]?.label.replace(" Year", "") || r.academicYear },
    { label: "Sem", width: 4, value: (r) => r.semester },
    { label: "Section", width: 5, value: (r) => r.section },
    { label: "Phone", width: 9, value: (r) => r.phoneNumber },
    { label: "GitHub", width: 13, value: (r) => (r.githubProfile ? r.githubProfile.replace("https://github.com/", "github.com/") : "-") },
    { label: "Type", width: 7, value: (r) => TYPE_LABEL[r.registrationType] },
    { label: "Preferences", width: 14, value: (r) => preferenceText(r, domainName) },
    { label: "Registered At", width: 9, value: (r) => formatDateTime(r.createdAt) },
  ];
  if (report.query && !("status" in report.query)) {
    columns.push({ label: "Status", width: 6, value: (r) => (r.status === "REGISTERED" ? "Registered" : "Withdrawn") });
  }
  const totalWidth = columns.reduce((s, c) => s + c.width, 0);

  const border = { style: BorderStyle.SINGLE, size: 4, color: "BFC5CE" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cell = (children, width, header) =>
    new TableCell({
      width: { size: (width / totalWidth) * 100, type: WidthType.PERCENTAGE },
      borders,
      shading: header ? { type: ShadingType.CLEAR, color: "auto", fill: "E8EEF5" } : undefined,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      children: [new Paragraph({ children: text(children, { bold: header, size: header ? 18 : 17 }) })],
    });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, children: columns.map((c) => cell(c.label, c.width, true)) }),
      ...rows.map((r, i) => new TableRow({ cantSplit: true, children: columns.map((c) => cell(c.value(r, i), c.width, false)) })),
    ],
  });

  const meta = (label, value) => new Paragraph({ spacing: { after: 40 }, children: [...text(`${label}: `, { bold: true, size: 20 }), ...text(value, { size: 20 })] });

  const doc = new Document({
    creator: "AdroIT Club, RNSIT",
    title: report.title,
    styles: { default: { document: { run: { font, size: 20 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.LANDSCAPE },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ font, size: 16, color: "6B7280", children: ["AdroIT Club, RNSIT  ·  Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: text("AdroIT Club · RNS Institute of Technology", { bold: true, size: 30 }) }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: text(settings.recruitmentName || "AdroIT Recruitment", { size: 22, color: "4B5563" }) }),
          new Paragraph({ spacing: { before: 120, after: 120 }, children: text(report.title, { bold: true, size: 28 }) }),
          meta("Generated", `${formatDateTime(now)} (IST)`),
          meta("Filters", report.filters.join("; ")),
          meta("Total records", String(rows.length)),
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          rows.length ? table : new Paragraph({ children: text("No registrations match this report.", { size: 20 }) }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
