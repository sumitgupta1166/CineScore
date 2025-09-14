// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import client from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await client.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = r.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("role", user.role || "user");
      client.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
