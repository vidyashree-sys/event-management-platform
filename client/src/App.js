import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainApp from "./pages/MainApp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClubDashboard from "./pages/ClubDashboard";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children, roles = [] }) {
  const { user, claims } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!claims) return <div className="p-4">Loading role...</div>; // 🔥 FIX: wait for claims

  if (roles.length > 0 && !roles.includes(claims.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, claims, loading } = useAuth();

  if (loading) return <div className="p-4">Loading user...</div>; // 🔥 FIX: wait for auth ready

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={["admin", "clubMember", "viewer"]}>
            {claims?.role === "admin" ? (
              <AdminDashboard />
            ) : claims?.role === "clubMember" ? (
              <ClubDashboard />
            ) : (
              <Dashboard />
            )}
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
