import express from "express";
import Proposal from "../models/Proposal.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/proposals
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.freelancerId = userId;
    }

    const proposals = await Proposal.find(query)
      .populate("projectId")
      .populate("freelancerId", "fullName email")
      .sort({ createdAt: -1 });

    // Format to match frontend expectations (projects field)
    const formattedProposals = proposals.map(proposal => ({
      ...proposal.toObject(),
      projects: proposal.projectId
    }));

    res.json(formattedProposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/proposals
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount, estimatedDuration } = req.body;

    // Check if proposal already exists
    const existingProposal = await Proposal.findOne({
      projectId,
      freelancerId: req.user.id,
    });

    if (existingProposal) {
      return res
        .status(400)
        .json({ message: "You have already submitted a proposal for this project" });
    }

    const proposal = await Proposal.create({
      projectId,
      freelancerId: req.user.id,
      coverLetter,
      bidAmount,
      estimatedDuration,
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/proposals/:proposalId
router.put("/:proposalId", authenticateToken, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Ensure only proposal owner can update
    if (proposal.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.proposalId,
      req.body,
      { new: true }
    );

    res.json(updatedProposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
