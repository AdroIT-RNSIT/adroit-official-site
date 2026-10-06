import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Crown, ImagePlus, Linkedin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { memberGroups as bundled } from "../data/members";
import { call } from "./api";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const PHOTO_TRANSFORM = "c_fill,g_face,w_800,h_800,f_auto,q_auto";
const EMPTY = { name: "", role: "Member", linkedin: "", photo: "" };

const clone = (groups) => JSON.parse(JSON.stringify(groups));
const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function validUrl(value, protocols) {
  if (!value.trim()) return true;
  try {
    return protocols.includes(new URL(value.trim()).protocol);
  } catch {
    return false;
  }
}

async function shrinkImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode"))), "image/webp", 0.85),
  );
}

function Avatar({ member, size = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [member.photo]);
  if (member.photo && !failed) {
    return <img src={member.photo} alt="" onError={() => setFailed(true)} className={`${size} shrink-0 rounded-lg object-cover`} />;
  }
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-slate-300`}>
      {initials(member.name || "?")}
    </span>
  );
}

function MemberForm({ initial, uploads, onSave, onCancel, onExpired }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_UPLOAD_BYTES) {
      setError("Pick an image under 15 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      let blob;
      try {
        blob = await shrinkImage(file);
      } catch {
        throw new Error("Couldn't read that image. Use a JPG, PNG or WebP.");
      }
      const { status, data } = await call("/members", {
        method: "POST",
        body: JSON.stringify({ action: "upload-signature" }),
      });
      if (status === 401) return onExpired();
      if (status !== 200) throw new Error(data.message || "Couldn't start the upload.");

      const body = new FormData();
      body.append("file", blob, "photo.webp");
      body.append("api_key", data.apiKey);
      body.append("timestamp", String(data.timestamp));
      body.append("signature", data.signature);
      body.append("folder", data.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, { method: "POST", body });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.secure_url) throw new Error(result.error?.message || "Upload failed.");
      setForm((f) => ({ ...f, photo: result.secure_url.replace("/image/upload/", `/image/upload/${PHOTO_TRANSFORM}/`) }));
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!validUrl(form.linkedin, ["https:", "http:"])) return setError("LinkedIn must be a full link, like https://www.linkedin.com/in/…");
    if (!validUrl(form.photo, ["https:"])) return setError("Photo must be an https link.");
    onSave({
      name: form.name.trim(),
      role: form.role,
      ...(form.linkedin.trim() ? { linkedin: form.linkedin.trim() } : {}),
      ...(form.photo.trim() ? { photo: form.photo.trim() } : {}),
    });
  };

  const input =
    "w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30";

  return (
    <form onSubmit={submit} className="space-y-4 border-t border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <Avatar member={form} size="h-16 w-16" />
        <div className="flex flex-wrap gap-2">
          {uploads && (
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 ${uploading ? "pointer-events-none opacity-50" : ""}`}>
              <ImagePlus size={16} aria-hidden="true" />
              {uploading ? "Uploading…" : "Upload photo"}
              <input type="file" accept="image/*" onChange={upload} className="sr-only" />
            </label>
          )}
          {form.photo && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, photo: "" }))} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
              Remove photo
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Name
          <input value={form.name} onChange={set("name")} maxLength={80} autoFocus className={`${input} mt-1.5`} />
        </label>
        <label className="block text-sm text-slate-300">
          Role
          <select value={form.role} onChange={set("role")} className={`${input} mt-1.5`}>
            <option value="Member">Member</option>
            <option value="Domain Lead">Domain Lead</option>
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          LinkedIn link <span className="text-slate-500">(optional)</span>
          <input value={form.linkedin} onChange={set("linkedin")} maxLength={500} inputMode="url" placeholder="https://www.linkedin.com/in/…" className={`${input} mt-1.5`} />
        </label>
        <label className="block text-sm text-slate-300">
          Photo link <span className="text-slate-500">(optional)</span>
          <input value={form.photo} onChange={set("photo")} maxLength={500} inputMode="url" placeholder="https://res.cloudinary.com/…" className={`${input} mt-1.5`} />
        </label>
      </div>

      {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={uploading} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:opacity-40">
          Done
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function MembersEditor({ onExpired }) {
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [fromCode, setFromCode] = useState(false);
  const [uploads, setUploads] = useState(false);
  const [active, setActive] = useState(bundled[0]?.id);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const dirty = draft !== null && JSON.stringify(draft) !== saved;

  const applyServer = useCallback((data) => {
    const groups = data.groups?.length ? data.groups : clone(bundled);
    setDraft(clone(groups));
    setSaved(JSON.stringify(groups));
    setUpdatedAt(data.updatedAt || null);
    setFromCode(!data.groups?.length);
    setEditing(null);
  }, []);

  const load = useCallback(async () => {
    setError("");
    try {
      const { status, data } = await call("/members");
      if (status === 401) return onExpired();
      if (status !== 200) return setError(data.message || "Couldn't load members.");
      setUploads(Boolean(data.uploads));
      applyServer(data);
    } catch {
      setError("Couldn't reach the server.");
    }
  }, [applyServer, onExpired]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const group = useMemo(() => draft?.find((g) => g.id === active) || draft?.[0], [draft, active]);

  const updateMembers = (fn) => {
    setNotice("");
    setDraft((groups) => groups.map((g) => (g.id === group.id ? { ...g, members: fn([...g.members]) } : g)));
  };

  const move = (index, delta) =>
    updateMembers((members) => {
      const [m] = members.splice(index, 1);
      members.splice(index + delta, 0, m);
      return members;
    });

  const save = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { status, data } = await call("/members", {
        method: "PUT",
        body: JSON.stringify({ groups: draft, baseUpdatedAt: updatedAt }),
      });
      if (status === 401) return onExpired();
      if (status !== 200) return setError(data.message || "Couldn't save.");
      applyServer(data);
      setNotice("Saved. The Members page shows the changes within a few seconds.");
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    setDraft(JSON.parse(saved));
    setEditing(null);
    setNotice("");
    setError("");
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b0b0b]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Users size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-white">Members</h2>
            <p className="mt-1 text-sm text-slate-400">
              {!draft
                ? "Loading…"
                : dirty
                  ? "You have unsaved changes."
                  : updatedAt
                    ? `Last saved ${new Date(updatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}.`
                    : "Not saved to the database yet."}
            </p>
          </div>
        </div>
        {draft && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!dirty || busy}
              onClick={discard}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
            >
              Discard
            </button>
            <button
              type="button"
              disabled={(!dirty && !fromCode) || busy || editing !== null}
              onClick={save}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div>

      {fromCode && draft && (
        <p className="border-b border-white/10 px-5 py-3 text-sm text-amber-300/90 sm:px-6">
          This is the list from the website code. Save once to move it into the database. After that, edits here go live without a redeploy.
        </p>
      )}
      {error && (
        <p role="alert" className="border-b border-white/10 px-5 py-3 text-sm text-rose-400 sm:px-6">
          {error}
          {error.includes("Reload") && (
            <button type="button" onClick={load} className="ml-2 underline">
              Reload
            </button>
          )}
        </p>
      )}
      {notice && <p className="border-b border-white/10 px-5 py-3 text-sm text-emerald-400 sm:px-6">{notice}</p>}

      {group && (
        <>
          <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2 sm:px-4">
            {draft.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setActive(g.id);
                  setEditing(null);
                }}
                aria-pressed={g.id === group.id}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
                  g.id === group.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {g.name} <span className="text-slate-500">{g.members.length}</span>
              </button>
            ))}
          </div>

          <ul className="divide-y divide-white/10">
            {group.members.map((m, i) => (
              <li key={`${group.id}-${i}`}>
                <div className="flex items-center gap-3 px-5 py-3 sm:px-6">
                  <Avatar member={m} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{m.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      {m.role === "Domain Lead" ? (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <Crown size={12} aria-hidden="true" /> Lead
                        </span>
                      ) : (
                        "Member"
                      )}
                      {m.linkedin && <Linkedin size={12} aria-label="Has LinkedIn" />}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-slate-400">
                    <button type="button" disabled={i === 0 || editing !== null} onClick={() => move(i, -1)} aria-label={`Move ${m.name} up`} className="rounded-lg p-2 hover:bg-white/5 hover:text-white disabled:opacity-30">
                      <ArrowUp size={16} />
                    </button>
                    <button type="button" disabled={i === group.members.length - 1 || editing !== null} onClick={() => move(i, 1)} aria-label={`Move ${m.name} down`} className="rounded-lg p-2 hover:bg-white/5 hover:text-white disabled:opacity-30">
                      <ArrowDown size={16} />
                    </button>
                    <button type="button" disabled={editing !== null} onClick={() => setEditing(i)} aria-label={`Edit ${m.name}`} className="rounded-lg p-2 hover:bg-white/5 hover:text-white disabled:opacity-30">
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={editing !== null}
                      onClick={() => updateMembers((members) => members.filter((_, j) => j !== i))}
                      aria-label={`Remove ${m.name}`}
                      className="rounded-lg p-2 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {editing === i && (
                  <MemberForm
                    initial={{ ...EMPTY, ...m }}
                    uploads={uploads}
                    onExpired={onExpired}
                    onCancel={() => setEditing(null)}
                    onSave={(member) => {
                      updateMembers((members) => members.map((x, j) => (j === i ? member : x)));
                      setEditing(null);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>

          {editing === "new" ? (
            <MemberForm
              initial={EMPTY}
              uploads={uploads}
              onExpired={onExpired}
              onCancel={() => setEditing(null)}
              onSave={(member) => {
                updateMembers((members) => [...members, member]);
                setEditing(null);
              }}
            />
          ) : (
            <div className="border-t border-white/10 p-4 sm:px-6">
              <button
                type="button"
                disabled={editing !== null}
                onClick={() => setEditing("new")}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
              >
                <Plus size={16} aria-hidden="true" />
                Add member to {group.name}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
