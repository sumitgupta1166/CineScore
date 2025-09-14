// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import client from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // include role in payload
      await client.post("/auth/register", { username, email, password, role });
      // after register, redirect to login
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-3">Create an account</h2>
      <p className="text-sm text-gray-500 mb-4">Choose whether you are signing up as a regular user or admin (for testing).</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input className="w-full p-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <div className="mt-2 flex gap-3">
            <label className={`px-3 py-1 rounded cursor-pointer ${role === "user" ? "bg-indigo-500 text-white" : "border"}`}>
              <input className="hidden" type="radio" name="role" value="user" checked={role === "user"} onChange={() => setRole("user")} />
              User
            </label>
            <label className={`px-3 py-1 rounded cursor-pointer ${role === "admin" ? "bg-purple-500 text-white" : "border"}`}>
              <input className="hidden" type="radio" name="role" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
              Admin
            </label>
          </div>
        </div>

        <div>
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded">Create account</button>
        </div>
      </form>
    </div>
  );
}
