import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogOut, Users, CalendarDays, BookOpen, ClipboardList } from "lucide-react";

const API = "/api/admin69";

async function call(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

const formatTime = (ms) =>
  new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [waitUntil, setWaitUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const inputRef = useRef(null);

  const waitLeft = Math.max(0, Math.ceil((waitUntil - now) / 1000));

  useEffect(() => {
    if (!waitUntil) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [waitUntil]);

  useEffect(() => {
    if (waitUntil && waitLeft === 0) {
      setWaitUntil(0);
      setError("");
      inputRef.current?.focus();
    }
  }, [waitUntil, waitLeft]);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || busy || waitLeft) return;
    setBusy(true);
    setError("");
    try {
      const { status, data } = await call("/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (status === 200) {
        onSuccess(data.expiresAt);
        return;
      }
      if (status === 429) {
        setNow(Date.now());
        setWaitUntil(Date.now() + (data.retryAfter || 60) * 1000);
        setError("Too many attempts.");
      } else if (status === 401) {
        setError(
          data.attemptsLeft > 0
            ? `Incorrect password. ${data.attemptsLeft} attempt${data.attemptsLeft === 1 ? "" : "s"} left before a lockout.`
            : "Incorrect password."
        );
      } else if (status === 503) {
        setError("Admin access isn't configured on the server yet.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setPassword("");
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
            <LockKeyhole size={20} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">Restricted area</h1>
            <p className="text-sm text-slate-400">Enter the admin password to continue.</p>
          </div>
        </div>

        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-300">
          Password
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="admin-password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            spellCheck={false}
            maxLength={256}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy || waitLeft > 0}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-error" : undefined}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 pr-12 font-mono text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-white"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p id="admin-error" role="alert" className="mt-3 min-h-5 text-sm text-rose-400">
          {error}
          {waitLeft > 0 && ` Try again in ${waitLeft}s.`}
        </p>

        <button
          type="submit"
          disabled={!password || busy || waitLeft > 0}
          className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}

const sections = [
  { name: "Members", Icon: Users },
  { name: "Events", Icon: CalendarDays },
  { name: "Resources", Icon: BookOpen },
];

function BootcampRegistrations({ onExpired }) {
  const [sessions, setSessions] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const handle = useCallback(
    ({ status, data }) => {
      if (status === 401) {
        onExpired();
        return;
      }
      if (status === 200) {
        setSessions(data.sessions);
        setError("");
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    },
    [onExpired]
  );

  useEffect(() => {
    call("/registrations")
      .then(handle)
      .catch(() => setError("Couldn't reach the server."));
  }, [handle]);

  const update = async (slugs, closed, key) => {
    setBusy(key);
    try {
      handle(await call("/registrations", { method: "POST", body: JSON.stringify({ slugs, closed }) }));
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy("");
    }
  };

  const all = sessions?.map((s) => s.slug) || [];
  const openCount = sessions?.filter((s) => !s.closed).length || 0;

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#0b0b0b]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ClipboardList size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Skill Up Boot Camp registration</h2>
            <p className="mt-1 text-sm text-slate-400">
              {sessions
                ? `${openCount} of ${sessions.length} sessions open. Changes apply on the website immediately.`
                : "Loading…"}
            </p>
          </div>
        </div>
        {sessions && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={Boolean(busy) || openCount === sessions.length}
              onClick={() => update(all, false, "all")}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
            >
              Open all
            </button>
            <button
              type="button"
              disabled={Boolean(busy) || openCount === 0}
              onClick={() => update(all, true, "all")}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
            >
              Close all
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="border-b border-white/10 px-5 py-3 text-sm text-rose-400 sm:px-6">
          {error}
        </p>
      )}

      <ul className="divide-y divide-white/10">
        {sessions?.map((s) => {
          const open = !s.closed;
          return (
            <li key={s.slug} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{s.day}</p>
                <p className="mt-0.5 font-medium text-white">{s.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${open ? "text-emerald-400" : "text-slate-500"}`}>
                  {busy === s.slug || busy === "all" ? "Saving…" : open ? "Open" : "Closed"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={open}
                  aria-label={`${s.title} registration`}
                  disabled={Boolean(busy)}
                  onClick={() => update([s.slug], open, s.slug)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                    open ? "bg-emerald-500" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-[#fff] shadow transition-transform ${
                      open ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Dashboard({ expiresAt, onSignOut, onExpired }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/ADROIT-logo.webp" alt="" className="h-8 w-8 rounded-lg" />
            <span className="font-semibold text-white">AdroIT Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">
              Session ends at {formatTime(expiresAt)}
            </span>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>

        <BootcampRegistrations onExpired={onExpired} />

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Coming once the backend is connected
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {sections.map(({ name, Icon }) => (
            <li key={name} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
              <Icon size={22} className="text-sky-400" aria-hidden="true" />
              <p className="mt-4 font-semibold text-white">{name}</p>
              <p className="mt-1 text-sm text-slate-500">Coming soon</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [state, setState] = useState({ phase: "checking", expiresAt: 0 });

  const lock = useCallback(() => setState({ phase: "locked", expiresAt: 0 }), []);

  useEffect(() => {
    let alive = true;
    call("/session")
      .then(({ status, data }) => {
        if (!alive) return;
        if (status === 200) setState({ phase: "in", expiresAt: data.expiresAt });
        else lock();
      })
      .catch(() => alive && lock());
    return () => {
      alive = false;
    };
  }, [lock]);

  useEffect(() => {
    if (state.phase !== "in") return undefined;
    const id = window.setTimeout(lock, Math.max(0, state.expiresAt - Date.now()));
    return () => window.clearTimeout(id);
  }, [state, lock]);

  const signOut = async () => {
    await call("/logout", { method: "POST", body: "{}" }).catch(() => {});
    lock();
  };

  if (state.phase === "checking") {
    return <div className="min-h-dvh" aria-busy="true" />;
  }
  if (state.phase === "locked") {
    return <Login onSuccess={(expiresAt) => setState({ phase: "in", expiresAt })} />;
  }
  return <Dashboard expiresAt={state.expiresAt} onSignOut={signOut} onExpired={lock} />;
}
