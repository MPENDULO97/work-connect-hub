import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/profiles/:userId
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/profiles/:userId
router.put("/:userId", authenticateToken, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { fullName, bio, skills, location, hourlyRate, profileImage } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { fullName, bio, skills, location, hourlyRate, profileImage },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
