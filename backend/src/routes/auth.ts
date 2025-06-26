import { Router, Request, Response } from "express";
import { login, register, verifyEmail } from "../controllers/authController";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and send verification email
 * @access  Public
 */
router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify user's email using the verification token
 * @access  Public
 */
router.get("/verify-email", (req: Request, res: Response) => {
  verifyEmail(req, res);
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

export default router;