import { createHmac } from "node:crypto";
import { ObjectId } from "mongodb";
import { collection } from "./mongo.js";

const COLLECTION = "contact_messages";
const LIST_LIMIT = 200;
export const RETENTION_DAYS = 7;
const RETENTION_SECONDS = RETENTION_DAYS * 24 * 60 * 60;

let indexesReady = null;

// MongoDB's TTL monitor deletes messages once createdAt is older than the retention window.
async function messages() {
  const col = await collection(COLLECTION);
  indexesReady ||= col
    .createIndexes([
      { key: { ipHash: 1, createdAt: -1 } },
      { key: { createdAt: 1 }, name: "expire_after_retention", expireAfterSeconds: RETENTION_SECONDS },
    ])
    .catch(() => {
      indexesReady = null;
    });
  await indexesReady;
  return col;
}

// The TTL monitor runs about once a minute, so hide anything already past the window.
const live = () => ({ createdAt: { $gte: new Date(Date.now() - RETENTION_SECONDS * 1000) } });

// Raw IPs aren't stored; a keyed hash is enough to rate-limit repeat senders.
const hashIp = (ip) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "adroit-contact").update(String(ip)).digest("base64url");

export async function countRecent(ip, sinceMs) {
  return (await messages()).countDocuments({ ipHash: hashIp(ip), createdAt: { $gte: new Date(Date.now() - sinceMs) } });
}

export async function saveMessage({ name, email, subject, message }, ip) {
  const { insertedId } = await (await messages()).insertOne({
    name,
    email,
    subject,
    message,
    read: false,
    emailed: false,
    ipHash: hashIp(ip),
    createdAt: new Date(),
  });
  return insertedId;
}

export async function markEmailed(id) {
  await (await messages()).updateOne({ _id: id }, { $set: { emailed: true } });
}

export async function listMessages() {
  const col = await messages();
  const [docs, unread, total] = await Promise.all([
    col
      .find(live(), { projection: { ipHash: 0 } })
      .sort({ createdAt: -1 })
      .limit(LIST_LIMIT)
      .toArray(),
    col.countDocuments({ ...live(), read: false }),
    col.countDocuments(live()),
  ]);
  return {
    unread,
    total,
    retentionDays: RETENTION_DAYS,
    messages: docs.map(({ _id, createdAt, ...rest }) => ({
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + RETENTION_SECONDS * 1000).toISOString(),
      ...rest,
    })),
  };
}

export function toObjectIds(ids) {
  if (!Array.isArray(ids) || !ids.length || ids.length > LIST_LIMIT) return null;
  if (!ids.every((id) => typeof id === "string" && ObjectId.isValid(id) && /^[a-f0-9]{24}$/i.test(id))) return null;
  return ids.map((id) => new ObjectId(id));
}

export async function setRead(ids, read) {
  await (await messages()).updateMany({ _id: { $in: ids } }, { $set: { read } });
}

export async function deleteMessages(ids) {
  await (await messages()).deleteMany({ _id: { $in: ids } });
}
