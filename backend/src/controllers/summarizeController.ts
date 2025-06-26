import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const summarizeNote = async (req: Request, res: Response) => {
  const { noteId } = req.body;
  const userId = req.user?.userId;

  if (!noteId) return res.status(400).json({ message: "Missing noteId." });

  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // if (note.summary) return res.json({ summary: note.summary });

    const prompt = `Please summarize the following note in one paragraph:\n\n${note.content}`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:  "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        //   "HTTP-Referer": "http://localhost:3000", // Or your production domain
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    await prisma.note.update({
      where: { id: noteId },
      data: { summary },
    });

    res.json({ summary });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Summarization failed" });
  }
};
