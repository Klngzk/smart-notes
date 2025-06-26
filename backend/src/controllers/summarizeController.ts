import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Summarize a note's content using an external AI API.
 * - Requires noteId in the request body.
 * - Checks that the note belongs to the authenticated user.
 * - Calls OpenRouter AI API to generate a summary.
 * - Stores the summary in the note and returns it.
 */
export const summarizeNote = async (req: Request, res: Response) => {
  const { noteId } = req.body;
  const userId = req.user?.userId;

  // Validate input
  if (!noteId) return res.status(400).json({ message: "Missing noteId." });

  try {
    // Find the note and ensure it belongs to the user
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Optionally, return cached summary if it exists
    // if (note.summary) return res.json({ summary: note.summary });

    // Prepare the prompt for the AI model
    const prompt = `Please summarize the following note in one paragraph:\n\n${note.content}`;

    // Call the OpenRouter AI API for summarization
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
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
          // "HTTP-Referer": "http://localhost:3000", // Uncomment and set for production if needed
          "Content-Type": "application/json",
        },
      }
    );

    // Extract summary from the API response
    const summary = response.data.choices[0].message.content;

    // Save the summary to the note in the database
    await prisma.note.update({
      where: { id: noteId },
      data: { summary },
    });

    // Return the summary to the client
    res.json({ summary });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Summarization failed" });
  }
};
