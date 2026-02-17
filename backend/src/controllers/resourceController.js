import Resource from "../models/resource.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * Trigger re-ingestion in the AI service to update RAG index with new resources
 */
async function triggerRAGIngestion() {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      console.log("✅ RAG ingestion triggered successfully");
    } else {
      console.warn(`⚠️ RAG ingestion response: ${response.status}`);
    }
  } catch (error) {
    console.warn(`⚠️ Could not trigger RAG ingestion: ${error.message}`);
  }
}

export const getResources = async (req, res) => {
  try {
    const { domain, type, difficulty, search } = req.query;
    const filter = {};

    if (domain) filter.domain = domain;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      createdBy: req.user.id,
    });
    await resource.save();
    
    // Trigger RAG ingestion in background (non-blocking)
    triggerRAGIngestion();
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    
    // Trigger RAG ingestion in background (non-blocking)
    triggerRAGIngestion();
    
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    
    // Trigger RAG ingestion in background (non-blocking)
    triggerRAGIngestion();
    
    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
