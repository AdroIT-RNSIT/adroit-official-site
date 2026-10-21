import { useState } from "react";
import { FileDown } from "lucide-react";
import { BTN, PANEL, download } from "./shared";
import { Notice } from "./ui";

function ExportButton({ label, query, busy, onRun }) {
  return (
    <button type="button" className={`${BTN} justify-between`} disabled={Boolean(busy)} onClick={() => onRun(query, label)}>
      <span>{busy === query ? "Preparing…" : label}</span>
      <FileDown size={16} aria-hidden="true" />
    </button>
  );
}

export default function Exports({ settings, onExpired }) {
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const tech = settings.domains.filter((d) => d.id !== "NON_TECH");
  const nonTech = settings.domains.find((d) => d.id === "NON_TECH");

  const run = async (query, label) => {
    setBusy(query);
    setNotice(null);
    const res = await download(`/api/admin69/recruitment/export?${query}`, onExpired);
    setBusy("");
    setNotice(res.ok ? { tone: "ok", text: `${label}: downloaded ${res.name} (${res.count} records).` } : { tone: "error", text: res.message });
  };

  const group = (title, description, items) => (
    <section className={`${PANEL} p-5 sm:p-6`}>
      <h3 className="font-semibold text-white">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map(([label, query]) => (
          <ExportButton key={query} label={label} query={query} busy={busy} onRun={run} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="grid gap-6">
      <p className="text-sm text-slate-400">
        Word (.docx) reports are generated on the server. Every report except "All registrations" covers active registrations only. For a custom
        list, filter the Registrations tab and use "Export these".
      </p>
      <Notice notice={notice} />
      {group("Everyone", null, [
        ["All registrations (incl. withdrawn)", "report=all"],
        ["Technical registrations", "report=technical"],
        [`${nonTech?.name || "Non-Tech"} only registrations`, "report=non-tech-only"],
        ["First-year registrations", "report=first-year"],
        ["Second-year registrations", "report=second-year"],
        [`${nonTech?.name || "Non-Tech"} as optional 3rd preference`, "report=non-tech-optional"],
      ])}
      {group(
        "Domain applicants",
        "Everyone who chose the domain as their first or second preference, listed once. Non-Tech only applicants are never included.",
        tech.map((d) => [`${d.name} applicants`, `report=domain&domain=${d.id}`]),
      )}
      {group(
        "By preference rank",
        "Separate lists for first and second preferences.",
        tech.flatMap((d) => [
          [`${d.name}: 1st preference`, `report=first-preference&domain=${d.id}`],
          [`${d.name}: 2nd preference`, `report=second-preference&domain=${d.id}`],
        ]),
      )}
    </div>
  );
}
