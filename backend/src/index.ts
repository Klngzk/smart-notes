import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check route
app.get("/", (_, res: any) => res.send("Smart Notes APII"));

// Authentication routes (register, login, verify email)
app.use("/api/auth", authRoutes);

// Notes routes (CRUD, summarize)
app.use("/api/notes", notesRoutes);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
