// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Movies from "./pages/Movies";
import MoviePage from "./pages/MoviePage";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    if (uid) setUser({ id: uid, role });
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return user && user.role === "admin" ? children : <Navigate to="/" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800">
      {/* Navbar/Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Movies */}
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviePage />} />

          {/* Profile */}
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center py-4 mt-auto shadow-lg">
        <p className="text-sm">
          🎬 CineScope &copy; {new Date().getFullYear()} | Built with MERN + Tailwind
        </p>
      </footer>
    </div>
  );
}
