import Member from "../models/members.js";
import Resource from "../models/resource.js";
import Event from "../models/event.js";
import Contact from "../models/contact.js";
import { db } from "../lib/auth.js";

export const getStats = async (req, res) => {
  try {
    const [membersCount, resourcesCount, eventsCount, contactsCount] =
      await Promise.all([
        Member.countDocuments(),
        Resource.countDocuments(),
        Event.countDocuments(),
        Contact.countDocuments(),
      ]);

    // Get user counts from better-auth collection
    let usersCount = 0;
    let pendingApprovals = 0;
    try {
      usersCount = await db.collection("user").countDocuments();
      pendingApprovals = await db
        .collection("user")
        .countDocuments({ approved: false });
    } catch (e) {
      // Non-critical if user collection query fails
      console.warn("Could not fetch user stats:", e.message);
    }

    res.json({
      membersCount,
      resourcesCount,
      eventsCount,
      contactsCount,
      usersCount,
      pendingApprovals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
