import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, CalendarDays, Clock, GraduationCap, MapPin, RefreshCw } from "lucide-react";
import RecruitmentForm from "../components/recruitment/RecruitmentForm";
import RecruitmentSuccess from "../components/recruitment/RecruitmentSuccess";
import { DOMAIN_ACCENTS, daysLeft, fetchRecruitmentConfig, formatDateTime, formatDay } from "../lib/recruitment";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function statusLine(status, offset) {
  if (status.open) {
    const left = daysLeft(status.closesAt, offset);
    if (status.closesAt) {
      return {
        tone: "success",
        label: "Registration open",
        detail: `Closes ${formatDateTime(status.closesAt)} IST${left ? ` · ${left === 1 ? "last day" : `${left} days left`}` : ""}`,
      };
    }
    return { tone: "success", label: "Registration open", detail: "Register before the deadline is announced." };
  }
  if (status.reason === "NOT_STARTED") {
    return { tone: "warning", label: "Opening soon", detail: `Registration opens ${formatDateTime(status.opensAt)} IST` };
  }
  if (status.reason === "ENDED") {
    return { tone: "muted", label: "Registration closed", detail: `Registration closed ${formatDateTime(status.closesAt)} IST` };
  }
  return { tone: "muted", label: "Registration closed", detail: "Registration isn't open right now." };
}

const LED = { success: "bg-success", warning: "bg-warning", muted: "bg-ink-subtle" };

function Fact({ icon, label, children }) {
  const Icon = icon;
  return (
    <div className="ui-well flex items-start gap-3 rounded-2xl p-4">
      <Icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-ink">{children}</p>
      </div>
    </div>
  );
}

function Closed({ config, status }) {
  const line = statusLine(status, 0);
  return (
    <section className="ui-card rounded-3xl p-6 text-center sm:p-10" aria-labelledby="recruit-closed">
      <span className="ui-well mx-auto grid h-16 w-16 place-items-center rounded-full text-primary" aria-hidden="true">
        <Clock size={28} />
      </span>
      <h2 id="recruit-closed" className="ui-heading mt-5 text-2xl font-bold text-ink">
        {status.reason === "NOT_STARTED" ? "Registration opens soon" : "Registration is closed"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-ink-muted">{line.detail}</p>
      {config.recruitmentDate && (
        <p className="mx-auto mt-4 max-w-md text-sm text-ink">
          Recruitment day: <strong className="font-semibold">{formatDay(config.recruitmentDate)}</strong>
          {config.recruitmentTime ? `, ${config.recruitmentTime}` : ""}
          {config.recruitmentVenue ? ` · ${config.recruitmentVenue}` : ""}
        </p>
      )}
      <p className="mx-auto mt-4 max-w-md text-sm text-ink-muted">
        Follow AdroIT on our socials and WhatsApp groups for the next announcement.
      </p>
      <Link to="/" className={`ui-solid mt-6 inline-flex min-h-11 items-center rounded-full px-6 py-2.5 text-sm font-semibold ${FOCUS}`}>
        Back to AdroIT
      </Link>
    </section>
  );
}

export default function Recruitment() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [registration, setRegistration] = useState(null);
  const [closedStatus, setClosedStatus] = useState(null);
  const formRef = useRef(null);

  const fetchConfig = useCallback(
    () =>
      fetchRecruitmentConfig().then(
        (data) => {
          setConfig(data);
          setOffset(new Date(data.serverTime).getTime() - Date.now());
          setError("");
        },
        (err) => setError(err.message),
      ),
    [],
  );

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const load = () => {
    setError("");
    fetchConfig();
  };

  useEffect(() => {
    document.title = "Recruitment | AdroIT";
  }, []);

  const scrollToForm = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="ui-heading text-2xl font-bold text-ink">Recruitment</h1>
        <p role="alert" className="mt-3 text-ink-muted">
          {error}
        </p>
        <button type="button" onClick={load} className={`ui-solid mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold ${FOCUS}`}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-busy="true" aria-label="Loading recruitment details">
        <div className="ui-well h-8 w-48 rounded-full motion-safe:animate-pulse" />
        <div className="ui-well mt-6 h-14 w-full max-w-xl rounded-2xl motion-safe:animate-pulse" />
        <div className="ui-well mt-4 h-24 w-full max-w-2xl rounded-2xl motion-safe:animate-pulse" />
      </div>
    );
  }

  const status = closedStatus || config.status;
  const line = statusLine(status, offset);
  const tech = config.domains.filter((d) => d.technical);
  const nonTech = config.domains.find((d) => !d.technical);
  const eligible = config.years.map((y) => y.label).join(" & ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-ink">AdroIT · RNSIT · CSE</p>
        <h1 className="ui-heading mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">{config.recruitmentName}</h1>
        {config.announcement && <p className="mt-4 text-lg text-ink-muted">{config.announcement}</p>}
        <p className="ui-chip mt-6 inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm text-ink" role="status">
          <span className={`h-2.5 w-2.5 rounded-full ${LED[line.tone]}`} aria-hidden="true" />
          <strong className="font-semibold">{line.label}</strong>
          <span className="text-ink-muted">· {line.detail}</span>
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact icon={GraduationCap} label="Who can apply">
          {eligible} CSE students
        </Fact>
        <Fact icon={Clock} label="Registration deadline">
          {status.closesAt ? `${formatDateTime(status.closesAt)} IST` : "To be announced"}
        </Fact>
        <Fact icon={CalendarDays} label="Recruitment day">
          {config.recruitmentDate ? `${formatDay(config.recruitmentDate)}${config.recruitmentTime ? `, ${config.recruitmentTime}` : ""}` : "To be announced"}
        </Fact>
        <Fact icon={MapPin} label="Venue">
          {config.recruitmentVenue || "To be announced"}
        </Fact>
      </div>

      {status.open && !registration && (
        <button type="button" onClick={scrollToForm} className={`ui-solid mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold ${FOCUS}`}>
          Register now
          <ArrowDown size={16} aria-hidden="true" />
        </button>
      )}

      <section className="mt-14" aria-labelledby="recruit-domains">
        <h2 id="recruit-domains" className="ui-heading text-2xl font-bold text-ink sm:text-3xl">
          The domains
        </h2>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Read what each team does, then pick the domains you genuinely want to work in: two technical domains (plus Non-Tech if you like), or Non-Tech on its own.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...tech, ...(nonTech ? [nonTech] : [])].map((d) => (
            <li key={d.id} className="ui-card flex flex-col rounded-2xl p-5" data-part="recruit-domain">
              <span className="h-1 w-10 rounded-full" style={{ backgroundColor: DOMAIN_ACCENTS[d.id] }} aria-hidden="true" />
              <p className="accent-ink mt-4 text-xs font-semibold uppercase tracking-[0.16em]" style={{ "--accent": DOMAIN_ACCENTS[d.id] }}>
                {d.technical ? "Technical" : "Non-Tech"}
              </p>
              <h3 className="ui-heading mt-1 text-lg font-bold text-ink">{d.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {config.instructions?.length > 0 && (
        <section className="mt-14 max-w-3xl" aria-labelledby="recruit-howto">
          <h2 id="recruit-howto" className="ui-heading text-2xl font-bold text-ink sm:text-3xl">
            Before you register
          </h2>
          <ul className="mt-4 grid gap-2.5">
            {config.instructions.map((item) => (
              <li key={item} className="flex gap-3 text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section ref={formRef} id="register" className="mt-14 scroll-mt-[calc(var(--nav-height)+1rem)]" aria-labelledby="recruit-register">
        <h2 id="recruit-register" className="ui-heading text-2xl font-bold text-ink sm:text-3xl">
          {registration ? "Registration complete" : "Register"}
        </h2>
        <div className="mt-6 max-w-3xl">
          {registration ? (
            <RecruitmentSuccess registration={registration} config={config} />
          ) : status.open ? (
            <RecruitmentForm
              config={config}
              onSuccess={(r) => {
                setRegistration(r);
                formRef.current?.scrollIntoView({ block: "start" });
              }}
              onClosed={(s) => setClosedStatus(s || { open: false, reason: "CLOSED" })}
            />
          ) : (
            <Closed config={config} status={status} />
          )}
        </div>
      </section>
    </div>
  );
}
