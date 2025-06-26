import { createNote, deleteNote, getNoteById, getUserNotes, updateNote } from "../controllers/notesController";
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { summarizeNote } from "../controllers/summarizeController";
const router = Router();



/**
 * @route   GET /api/notes/
 * @desc    Get all notes for the authenticated user (with optional search and pagination)
 * @access  Private
 */
router.get("/", authMiddleware as any, getUserNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID for the authenticated user
 * @access  Private
 */
router.get("/:id", authMiddleware as any, getNoteById as any);

/**
 * @route   POST /api/notes/add
 * @desc    Create a new note for the authenticated user
 * @access  Private
 */
router.post("/add", authMiddleware as any, createNote as any);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note by ID for the authenticated user
 * @access  Private
 */
router.put("/:id", authMiddleware as any, updateNote as any);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note by ID for the authenticated user
 * @access  Private
 */
router.delete("/:id", authMiddleware as any, deleteNote as any);

/**
 * @route   POST /api/notes/summarize
 * @desc    Summarize a note's content using AI for the authenticated user
 * @access  Private
 */
router.post("/summarize", authMiddleware as any, summarizeNote as any);

export default router;