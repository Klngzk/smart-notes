import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  loading?: boolean;
  error?: string;
  onSubmit: (title: string, content: string) => Promise<void> | void;
  submitLabel?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  initialTitle = "",
  initialContent = "",
  loading = false,
  error,
  onSubmit,
  submitLabel = "Save Note",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, content);
  };

  // Determine button color: yellow for edit, blue for add
  const isEdit =
    submitLabel.toLowerCase().includes("edit") ||
    submitLabel.toLowerCase().includes("change");
  const buttonClass = isEdit
    ? "w-full sm:w-1/2 bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition disabled:opacity-50 shadow cursor-pointer"
    : "w-full sm:w-1/2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow cursor-pointer";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-xl shadow-lg p-8 border border-gray-100"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline font-medium mb-4"
      >
        <FiArrowLeft /> Back
      </button>
      <div>
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="content"
        >
          Content
        </label>
        <textarea
          id="content"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          maxLength={2000}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {content.length}/2000 characters
        </div>
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default NoteForm;