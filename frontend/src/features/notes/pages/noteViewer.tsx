import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/authContext";
import { deleteNote, fetchNoteById, summarizeNote } from "../api";
import type { Note } from "../types";
import { FaSpinner } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiArrowLeft, FiZap } from "react-icons/fi";
import ConfirmModal from "../../../components/modal";

const NoteViewer = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    fetchNoteById(token, id)
      .then((data) => {
        setNote(data);
        setSummary(data.summary || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleDelete = async () => {
    if (!token || !id) return;
    try {
      await deleteNote(token, id);
      setShowDeleteModal(false);
      navigate("/notes");
    } catch (err: any) {
      alert(err.message || "Failed to delete note");
    }
  };

  const handleSummarize = async () => {
    if (!note || !token) return;
    setLoadingSummary(true);
    setError("");

    try {
      const result = await summarizeNote(token, note.id);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "Error summarizing note");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-600 text-lg">Loading note...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-center text-red-600 text-lg">{error}</p>
        <button
          onClick={() => navigate("/notes")}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiArrowLeft /> Back to Notes
        </button>
      </div>
    );
  if (!note) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8 bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline font-medium"
        >
          <FiArrowLeft /> Back
        </button>
        <span className="text-sm text-gray-400">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        {note.title}
      </h2>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
        <p className="whitespace-pre-wrap text-gray-800 break-words text-lg leading-relaxed">
          {note.content}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center">
        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-full shadow hover:bg-blue-700 flex items-center justify-center gap-2 transition disabled:opacity-60 w-full sm:w-auto"
        >
          {loadingSummary ? (
            <>
              <FaSpinner className="animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <FiZap />
              {summary ? "Summarize Again" : "Summarize"}
            </>
          )}
        </button>
        <button
          onClick={() => navigate(`/notes/${id}/edit`)}
          className="bg-yellow-500 text-white px-5 py-2 cursor-pointer rounded-full shadow hover:bg-yellow-600 flex items-center justify-center gap-2 transition w-full sm:w-auto"
        >
          <FiEdit2 />
          Edit
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-5 py-2 cursor-pointer rounded-full shadow hover:bg-red-700 flex items-center justify-center gap-2 transition w-full sm:w-auto"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Summary</h3>
        <div className="bg-gray-100 p-4 rounded text-gray-700 whitespace-pre-wrap min-h-[60px] border border-gray-200">
          {summary || (
            <span className="text-gray-400">No summary available.</span>
          )}
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default NoteViewer;
