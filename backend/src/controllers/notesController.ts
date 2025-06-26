import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//TODO: fix "any" types for req

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

export const updateNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;
  const noteId = req.params.id;

  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const noteId = req.params.id;

  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    await prisma.note.delete({ where: { id: noteId } });

    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
