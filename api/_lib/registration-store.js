import { MongoClient } from "mongodb";
import { BOOTCAMP_SESSIONS } from "./bootcamp-sessions.js";

const COLLECTION = "registration_status";

export const defaultClosed = () =>
  Object.fromEntries(BOOTCAMP_SESSIONS.map((s) => [s.slug, s.closed]));

export const storeConfigured = () => Boolean(process.env.MONGODB_URI);

// Reused across invocations while the serverless instance stays warm.
let clientPromise = null;

function collection() {
  clientPromise ||= new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 5,
  })
    .connect()
    .catch((err) => {
      clientPromise = null;
      throw err;
    });
  return clientPromise.then((client) =>
    client.db(process.env.MONGODB_DB || "adroit").collection(COLLECTION),
  );
}

export async function readClosed() {
  const closed = defaultClosed();
  const docs = await (await collection()).find({}, { projection: { closed: 1 } }).toArray();
  for (const doc of docs) {
    if (doc._id in closed) closed[doc._id] = Boolean(doc.closed);
  }
  return closed;
}

export async function writeClosed(slugs, closed) {
  const updatedAt = new Date();
  await (await collection()).bulkWrite(
    slugs.map((slug) => ({
      updateOne: { filter: { _id: slug }, update: { $set: { closed, updatedAt } }, upsert: true },
    })),
  );
}
