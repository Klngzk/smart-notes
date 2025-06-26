import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * Get all notes for the authenticated user.
 * Supports search, pagination (take & skip), and sorts by newest first.
 */
export const getUserNotes = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const search = req.query.search?.toString();
  const take = parseInt(req.query.take as string) || 4;
  const skip = parseInt(req.query.skip as string) || 0;

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    res.json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

/**
 * Create a new note for the authenticated user.
 * Requires title and content in the request body.
 */
export const createNote = async (req: any, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const newNote = await prisma.note.create({
      data: { title, content, userId },
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create note." });
  }
};

/**
 * Get a single note by ID for the authenticated user.
 * Ensures the note belongs to the user.
 */
export const getNoteById = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user?.userId;

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId, // Ensures user only accesses their notes
      },
    });

    if (!note) return res.status(404).json({ message: "Note not found." });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note." });
  }
};

/**
 * Update a note by ID for the authenticated user.
 * Only allows updating notes that belong to the user.
 */
export const updateNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;
  const noteId = req.params.id;

  try {
    // Find the note and ensure it belongs to the user
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Update the note
    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update note" });
  }
};

/**
 * Delete a note by ID for the authenticated user.
 * Only allows deleting notes that belong to the user.
 */
export const deleteNote = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const noteId = req.params.id;

  try {
    // Find the note and ensure it belongs to the user
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Delete the note
    await prisma.note.delete({ where: { id: noteId } });

    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
