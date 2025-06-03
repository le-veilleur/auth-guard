import express from "express";
import authRoutes from "./auth.routes";
import verificationRoutes from "./verification.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/verify", verificationRoutes);
router.use("/user", userRoutes);

export default router;