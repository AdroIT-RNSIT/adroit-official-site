import Member from "../models/members.js";
import Resource from "../models/resource.js";
import Event from "../models/event.js";

export const getStats = async (req, res) => {
  try {
    const [membersCount, resourcesCount, eventsCount] = await Promise.all([
      Member.countDocuments(),
      Resource.countDocuments(),
      Event.countDocuments(),
    ]);
    res.json({ membersCount, resourcesCount, eventsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
