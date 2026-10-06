import { useCallback, useEffect, useState } from "react";
import { Inbox as InboxIcon, Mail, MailOpen, RefreshCw, Reply, Trash2 } from "lucide-react";
import { call } from "./api";

const formatDate = (iso) => new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export default function Inbox({ onExpired, onUnreadChange }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = useCallback(
    ({ status, data: body }) => {
      if (status === 401) return onExpired();
      if (status !== 200) return setError(body.message || "Something went wrong. Try again.");
      setData(body);
      setError("");
      onUnreadChange(body.unread);
    },
    [onExpired, onUnreadChange],
  );

  const load = useCallback(async () => {
    setBusy(true);
    try {
      handle(await call("/messages"));
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  }, [handle]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (action, ids) => {
    setBusy(true);
    try {
      handle(await call("/messages", { method: "POST", body: JSON.stringify({ action, ids }) }));
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = (msg) => {
    const opening = openId !== msg.id;
    setOpenId(opening ? msg.id : null);
    if (opening && !msg.read) act("read", [msg.id]);
  };

  const remove = (msg) => {
    if (!window.confirm(`Delete the message from ${msg.name}? This can't be undone.`)) return;
    setOpenId(null);
    act("delete", [msg.id]);
  };

  const shown = data?.messages.filter((m) => filter === "all" || !m.read) || [];
  const unreadIds = data?.messages.filter((m) => !m.read).map((m) => m.id) || [];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b0b0b]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <InboxIcon size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Contact inbox</h2>
            <p className="mt-1 text-sm text-slate-400">
              {data ? `${data.unread} unread of ${data.total}. Messages from the Contact page land here.` : "Loading…"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-white/10 p-0.5 text-sm">
            {["all", "unread"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-md px-3 py-1.5 capitalize ${filter === f ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={busy || !unreadIds.length}
            onClick={() => act("read", unreadIds)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
          >
            Mark all read
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={load}
            aria-label="Refresh"
            className="rounded-lg border border-white/10 px-3 py-2 text-slate-200 hover:bg-white/5 disabled:opacity-40"
          >
            <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="border-b border-white/10 px-5 py-3 text-sm text-rose-400 sm:px-6">
          {error}
        </p>
      )}

      {data && !shown.length && (
        <p className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6">
          {filter === "unread" ? "No unread messages." : "No messages yet."}
        </p>
      )}

      <ul className="divide-y divide-white/10">
        {shown.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => toggle(m)}
                aria-expanded={open}
                className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.03] sm:px-6"
              >
                <span
                  aria-label={m.read ? undefined : "Unread"}
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-sky-400"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={`truncate ${m.read ? "text-slate-300" : "font-semibold text-white"}`}>{m.name}</span>
                    <span className="shrink-0 text-xs text-slate-500">{formatDate(m.createdAt)}</span>
                  </span>
                  <span className={`mt-0.5 block truncate text-sm ${m.read ? "text-slate-400" : "text-slate-200"}`}>{m.subject}</span>
                  {!open && <span className="mt-0.5 block truncate text-sm text-slate-500">{m.message}</span>}
                </span>
              </button>

              {open && (
                <div className="px-5 pb-5 sm:px-6 sm:pl-11">
                  <p className="text-sm text-slate-400">
                    From <span className="text-slate-200">{m.name}</span> &lt;{m.email}&gt;
                    {!m.emailed && <span className="ml-2 rounded bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-300">Email copy not delivered</span>}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black p-4 text-sm leading-relaxed text-slate-200">
                    {m.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-black hover:bg-sky-400"
                    >
                      <Reply size={16} aria-hidden="true" />
                      Reply
                    </a>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setOpenId(null);
                        act(m.read ? "unread" : "read", [m.id]);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
                    >
                      {m.read ? <Mail size={16} aria-hidden="true" /> : <MailOpen size={16} aria-hidden="true" />}
                      Mark {m.read ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove(m)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 disabled:opacity-40"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {data && data.total > data.messages.length && (
        <p className="border-t border-white/10 px-5 py-3 text-xs text-slate-500 sm:px-6">
          Showing the newest {data.messages.length} messages.
        </p>
      )}
    </section>
  );
}
