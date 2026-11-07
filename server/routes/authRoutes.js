import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "patient" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!["patient", "doctor", "hospital", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "Account created",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

export default router;
