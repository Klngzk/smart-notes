// TODO: Go back button
// TODO: max characters for title and content
// TODO: alert for deletion
// TODO: notification for edit and delete
// TODO: reforme form to be used again for add and edit
// TODO: custom form validation

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNotes } from "../api";
import type { Note } from "../types";
import { useAuth } from "../../auth/context/authContext";
import { Link } from "react-router-dom";
import NoteCard from "../../../components/noteCard";
import FloatingBtn from "../../../components/floatingBtn";
import SearchBar from "../../../components/search";

const NoteList = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastNoteRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetchNotes(token, search, page)
      .then((newNotes) => {
        setNotes((prev) => (page === 0 ? newNotes : [...prev, ...newNotes]));
        setHasMore(newNotes.length === 4);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, search, page]);

  // Reset on search
  useEffect(() => {
    setPage(0);
    setNotes([]);
    setHasMore(true);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <FloatingBtn />

      <div className="text-center mt-8 mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, idx) => {
          const noteCard = (
            <Link to={`/notes/${note.id}`} key={note.id} className="block">
              <NoteCard
                title={note.title}
                content={note.content}
                date={new Date(note.createdAt).toLocaleDateString()}
              />
            </Link>
          );

          // Attach ref to the last item
          if (idx === notes.length - 1) {
            return (
              <div ref={lastNoteRef} key={note.id}>
                {noteCard}
              </div>
            );
          }

          return noteCard;
        })}

        {!loading && notes.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No notes found.
          </p>
        )}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-6">Loading more notes...</p>
      )}
    </div>
  );
};

export default NoteList;
