import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Planning from "./pages/planning";
import Estimation from "./pages/estimation";
import Community from "./pages/community";
import ProjectDetails from "./pages/projectDetails";
import Profile from "./pages/profile";
import Admin from "./pages/admin";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/planning"
                element={<Planning />}
              />

              <Route
                path="/estimation"
                element={<Estimation />}
              />

              <Route
                path="/community"
                element={<Community />}
              />

              <Route
                path="/projects/:id"
                element={<ProjectDetails />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/admin"
                element={<Admin />}
              />
            </Route>
          </Route>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;