import { collection } from "./mongo.js";

const COLLECTION = "site_content";
const DOC_ID = "members";
const ROLES = new Set(["Domain Lead", "Member"]);

export class ConflictError extends Error {}

const text = (value, max) => {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length <= max ? s : null;
};

function url(value, protocols) {
  const s = text(value, 500);
  if (!s) return s === "" ? "" : null;
  try {
    const u = new URL(s);
    return protocols.includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}

export function validateGroups(input) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 20) return { error: "Invalid member list." };
  const ids = new Set();
  const groups = [];
  for (const g of input) {
    const id = text(g?.id, 24);
    const name = text(g?.name, 60);
    if (!id || !/^[a-z0-9-]+$/.test(id) || ids.has(id) || !name) return { error: "Invalid domain in the list." };
    if (!Array.isArray(g.members) || g.members.length > 200) return { error: `Too many members in ${name}.` };
    ids.add(id);
    const members = [];
    for (const m of g.members) {
      const memberName = text(m?.name, 80);
      const role = ROLES.has(m?.role) ? m.role : null;
      const linkedin = url(m?.linkedin, ["https:", "http:"]);
      const photo = url(m?.photo, ["https:"]);
      if (!memberName) return { error: `Every member in ${name} needs a name.` };
      if (!role) return { error: `${memberName} has an invalid role.` };
      if (linkedin === null) return { error: `${memberName}'s LinkedIn link isn't a valid URL.` };
      if (photo === null) return { error: `${memberName}'s photo must be an https URL.` };
      members.push({ name: memberName, role, ...(linkedin ? { linkedin } : {}), ...(photo ? { photo } : {}) });
    }
    groups.push({ id, name, members });
  }
  return { groups };
}

export async function readMembers() {
  const doc = await (await collection(COLLECTION)).findOne({ _id: DOC_ID });
  return doc ? { groups: doc.groups, updatedAt: doc.updatedAt.toISOString() } : { groups: null, updatedAt: null };
}

// `baseUpdatedAt` is the version the editor started from, so two admins can't silently overwrite each other.
export async function writeMembers(groups, baseUpdatedAt) {
  const updatedAt = new Date();
  const filter = { _id: DOC_ID, updatedAt: baseUpdatedAt ? new Date(baseUpdatedAt) : { $exists: false } };
  try {
    const result = await (await collection(COLLECTION)).updateOne(
      filter,
      { $set: { groups, updatedAt } },
      { upsert: true },
    );
    if (!result.matchedCount && !result.upsertedCount) throw new ConflictError();
  } catch (err) {
    if (err?.code === 11000) throw new ConflictError();
    throw err;
  }
  return { groups, updatedAt: updatedAt.toISOString() };
}
