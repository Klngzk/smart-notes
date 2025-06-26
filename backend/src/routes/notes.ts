import { createNote, deleteNote, getNoteById, getUserNotes, updateNote } from "../controllers/notesController";
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { summarizeNote } from "../controllers/summarizeController";
const router = Router();

//TODO:fix "any" type

router.get("/", authMiddleware as any , getUserNotes);
router.get("/:id", authMiddleware as any, getNoteById as any);
router.post("/add", authMiddleware as any, createNote as any);
router.put("/:id", authMiddleware as any, updateNote as any);
router.delete("/:id", authMiddleware as any, deleteNote as any);
router.post("/summarize", authMiddleware as any, summarizeNote as any);


export default router;