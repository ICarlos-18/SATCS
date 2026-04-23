import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";

// 🔥 IMPORTANTE
import ErrorBoundary from "./components/ErrorBoundary";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import AreasPage from "./pages/AreasPage";
import TasksPage from "./pages/TasksPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import SchedulesPage from "./pages/SchedulesPage";
import ReportesPage from "./pages/ReportesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* =========================
   🔐 PROTECTED ROUTE
========================= */
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (
    allowedRoles &&
    currentUser &&
    !allowedRoles.includes(currentUser.rol)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

/* =========================
   🔓 LOGIN ROUTE
========================= */
function AuthRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <LoginPage />;
}

/* =========================
   🚀 APP
========================= */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />

      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* 🔓 LOGIN */}
            <Route path="/" element={<AuthRoute />} />

            {/* 🧠 DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 👥 USERS */}
            <Route
              path="/usuarios"
              element={
                <ErrorBoundary>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UsersPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 🏢 AREAS */}
            <Route
              path="/areas"
              element={
                <ErrorBoundary>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AreasPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 📋 TASKS */}
            <Route
              path="/tareas"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* ⭐ EVALUACIONES */}
            <Route
              path="/evaluaciones"
              element={
                <ErrorBoundary>
                  <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                    <EvaluationsPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 💡 SUGERENCIAS */}
            <Route
              path="/sugerencias"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <SuggestionsPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 📢 AVISOS */}
            <Route
              path="/avisos"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <AnnouncementsPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* ⏰ HORARIOS */}
            <Route
              path="/horarios"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <SchedulesPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 📊 REPORTES */}
            <Route
              path="/reportes"
              element={
                <ErrorBoundary>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ReportesPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* ❌ NOT FOUND */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;