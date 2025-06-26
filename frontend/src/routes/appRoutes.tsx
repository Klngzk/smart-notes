import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../layout/appLayout";
import { useAuth } from "../features/auth/context/authContext";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";
import VerifyEmail from "../features/auth/pages/verifyEmail";
import NoteList from "../features/notes/pages/notes";
import ProtectedRoute from "../components/protectedRoutes";
import NoteViewer from "../features/notes/pages/noteViewer";
import NotFound from "../notFound";
import NoteEditor from "../features/notes/pages/noteEditor";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" />} />
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NoteList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/create"
          element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/edit"
          element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
};
