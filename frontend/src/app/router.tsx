import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import ProtectedRoute from "@/routes/ProtectedRoute";

// Temporary Pages
function WorkspacesPage() {
  return <h1 className="text-4xl p-10">Workspaces 🚀</h1>;
}

function PipelinesPage() {
  return <h1 className="text-4xl p-10">Pipelines 🚀</h1>;
}

function JobsPage() {
  return <h1 className="text-4xl p-10">Jobs 🚀</h1>;
}

function LogsPage() {
  return <h1 className="text-4xl p-10">Logs 🚀</h1>;
}

function SettingsPage() {
  return <h1 className="text-4xl p-10">Settings 🚀</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Protected */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <WorkspacesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pipelines"
          element={
            <ProtectedRoute>
              <PipelinesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}