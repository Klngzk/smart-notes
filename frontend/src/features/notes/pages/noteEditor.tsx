import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchNoteById, createNote, updateNote } from "../api";
import { useAuth } from "../../auth/context/authContext";
import NoteForm from "../../../components/noteForm";

const NoteEditor = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEdit); // only load if editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset form when switching from edit to add mode
    if (!id) {
      setTitle("");
      setContent("");
      setError("");
      setLoading(false);
      setSaving(false);
    }
  }, [id]);
  useEffect(() => {
    if (isEdit && token && id) {
      setLoading(true);
      fetchNoteById(token, id)
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isEdit, token, id]);

  useEffect(() => {
    // Reset form when switching from edit to add mode
    if (!id) {
      setTitle("");
      setContent("");
      setError("");
      setLoading(false);
      setSaving(false);
    }
  }, [id]);

  const handleSubmit = async (newTitle: string, newContent: string) => {
    setSaving(true);
    setError("");
    try {
      if (isEdit && id && token) {
        await updateNote(token, id, { title: newTitle, content: newContent });
        navigate(`/notes/${id}`);
      } else if (token) {
        await createNote(token, { title: newTitle, content: newContent });
        navigate("/notes");
      }
    } catch (err: any) {
      setError(err.message || "Error saving note.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error && !isEdit)
    return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Note" : "Create a New Note"}
      </h2>
      <NoteForm
        initialTitle={title}
        initialContent={content}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        submitLabel={isEdit ? "Save Changes" : "Save Note"}
      />
    </div>
  );
};

export default NoteEditor;
