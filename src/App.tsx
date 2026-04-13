import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
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

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.rol)) return <Navigate to="/dashboard" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LoginPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthRoute />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
            <Route path="/areas" element={<ProtectedRoute allowedRoles={['admin']}><AreasPage /></ProtectedRoute>} />
            <Route path="/tareas" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/evaluaciones" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><EvaluationsPage /></ProtectedRoute>} />
            <Route path="/sugerencias" element={<ProtectedRoute><SuggestionsPage /></ProtectedRoute>} />
            <Route path="/avisos" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/horarios" element={<ProtectedRoute><SchedulesPage /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute allowedRoles={['admin']}><ReportesPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
