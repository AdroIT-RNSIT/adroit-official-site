import { collection } from "./mongo.js";

// Same database and `site_content` collection as the members list.
const COLLECTION = "site_content";
const DOC_ID = "ui-design";

export async function readUiDesign() {
  const doc = await (await collection(COLLECTION)).findOne({ _id: DOC_ID });
  if (!doc || typeof doc.design !== "string") return null;
  return {
    design: doc.design,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : null,
    updatedBy: typeof doc.updatedBy === "string" ? doc.updatedBy : null,
  };
}

export async function writeUiDesign(design, updatedBy) {
  const updatedAt = new Date();
  await (await collection(COLLECTION)).updateOne(
    { _id: DOC_ID },
    { $set: { design, updatedAt, updatedBy } },
    { upsert: true },
  );
  return { design, updatedAt: updatedAt.toISOString(), updatedBy };
}
