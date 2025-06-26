import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res : any) => res.send("Smart Notes APII"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
