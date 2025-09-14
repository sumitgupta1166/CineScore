// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role"); // set on login/register

  const handleLogout = async () => {
    try {
      await fetch((import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1") + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold">MR</div>
          <div className="text-xl font-semibold tracking-tight">CineScope</div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/movies" className="hover:underline">Movies</Link>
          <Link to="/movies?tab=trending" className="hover:underline">Trending</Link>
          {userId ? (
            <>
              <Link to={`/profile/${userId}`} className="hover:underline">Profile</Link>
              {role === "admin" && <Link to="/admin" className="hover:underline">Admin</Link>}
              <button onClick={handleLogout} className="ml-2 px-3 py-1 rounded bg-red-500 hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded border border-white/20">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-white text-indigo-700">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
