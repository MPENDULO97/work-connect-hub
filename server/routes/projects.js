import express from "express";
import Project from "../models/Project.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/projects
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    
    let query = {};
    if (userId) {
      query.clientId = userId;
    }

    const projects = await Project.find(query)
      .populate("clientId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:projectId
router.get("/:projectId", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "clientId",
      "fullName email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      budgetMin,
      budgetMax,
      projectType,
      skills,
      deadline,
      category,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      clientId: req.user.id,
      budgetMin,
      budgetMax,
      projectType,
      skills,
      deadline,
      category,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:projectId
router.put("/:projectId", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure only project owner can update
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
