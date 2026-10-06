import { collection, mongoConfigured } from "./mongo.js";
import { BOOTCAMP_SESSIONS } from "./bootcamp-sessions.js";

const COLLECTION = "registration_status";

export const defaultClosed = () =>
  Object.fromEntries(BOOTCAMP_SESSIONS.map((s) => [s.slug, s.closed]));

export const storeConfigured = mongoConfigured;

export async function readClosed() {
  const closed = defaultClosed();
  const docs = await (await collection(COLLECTION)).find({}, { projection: { closed: 1 } }).toArray();
  for (const doc of docs) {
    if (doc._id in closed) closed[doc._id] = Boolean(doc.closed);
  }
  return closed;
}

export async function writeClosed(slugs, closed) {
  const updatedAt = new Date();
  await (await collection(COLLECTION)).bulkWrite(
    slugs.map((slug) => ({
      updateOne: { filter: { _id: slug }, update: { $set: { closed, updatedAt } }, upsert: true },
    })),
  );
}
