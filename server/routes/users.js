import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/:userId/roles
router.get("/:userId/roles", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("roles");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return in format expected by frontend
    const roles = user.roles.map(role => ({ role }));
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
