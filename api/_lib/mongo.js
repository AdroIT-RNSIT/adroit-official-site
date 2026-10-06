import { MongoClient } from "mongodb";

export const mongoConfigured = () => Boolean(process.env.MONGODB_URI);

// Reused across invocations while the serverless instance stays warm.
let clientPromise = null;

export async function collection(name) {
  if (!mongoConfigured()) throw new Error("MongoDB isn't connected to this project yet.");
  clientPromise ||= new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 5,
  })
    .connect()
    .catch((err) => {
      clientPromise = null;
      throw err;
    });
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "adroit").collection(name);
}
