import express from "express";
import { login, verifyEmail, requestPasswordReset, resetPassword  } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);


export default router;
