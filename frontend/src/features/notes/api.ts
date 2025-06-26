import type { Note } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchNotes = async (
  token: string,
  search: string = "",
  page: number = 0,
  limit: number = 4
) => {
  const query = new URLSearchParams({
    search,
    skip: String(page * limit),
    take: String(limit),
  });

  const res = await fetch(`${API_URL}/api/notes?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch notes");
  return data;
};

export const createNote = async (token: string, note: { title: string; content: string }) => {
  const res = await fetch(`${API_URL}/api/notes/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create note");
  return data;
};

export const fetchNoteById = async (token: string, id: string): Promise<Note> => {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Note not found.");
  return data;
};

export const updateNote = async (token: string, id: string, note: { title: string; content: string }) => {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update note");
  return data;
};

export const deleteNote = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete note");
  return data;
};

export const summarizeNote = async (token: string, noteId: string): Promise<string> => {
  const res = await fetch(`${API_URL}/api/notes/summarize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ noteId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to summarize note");
  return data.summary;
};





