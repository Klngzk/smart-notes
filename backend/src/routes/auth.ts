import { Router, Request, Response } from "express";
import { login, register, verifyEmail } from "../controllers/authController";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});
router.get("/verify-email", (req: Request, res: Response) => {
  verifyEmail(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

export default router;