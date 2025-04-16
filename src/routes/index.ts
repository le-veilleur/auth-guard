import express from "express";
import authRoutes from "./auth.routes";
import verificationRoutes from "./verification.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/verify", verificationRoutes);

export default router;