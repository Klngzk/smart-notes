import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/email";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Regex for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register a new user.
 * - Validates email and password.
 * - Checks if email is already registered.
 * - Sends verification email before creating the user.
 * - Hashes password before saving.
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const verificationToken = uuidv4();

    // Try sending the verification email first
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      return res.status(500).json({ message: "Failed to send verification email. Please check your email address." });
    }

    // Only create the user if email was sent successfully
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    res.status(201).json({ message: "Registered. Please check your email to verify." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * Verify user's email using the verification token.
 * - Finds user by verification token.
 * - Sets emailVerified to true if token is valid.
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid verification token." });
  }

  try {
    // Find user with the given verification token
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });

    if (!user) return res.status(404).json({ message: "Invalid verification token." });

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
      },
    });

    res.json({ message: "Email successfully verified." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * Login user.
 * - Checks if user exists and password is correct.
 * - Checks if email is verified.
 * - Returns JWT token if successful.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET! || "default",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } as jwt.SignOptions
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
