// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import client from "../lib/api";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", genres: "", releaseYear: "", director: "", synopsis: "" });

  const load = async () => {
    try {
      const res = await client.get("/movies?limit=50");
      setMovies(res.data.data.data);
    } catch (e) { setMovies([]); }

    try {
      // if your backend has an admin users listing route, use that. Otherwise skip.
      const u = await client.get("/admin/users");
      setUsers(u.data.data || []);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { load(); }, []);

  const createMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, genres: form.genres.split(",").map((g) => g.trim()) };
      const r = await client.post("/movies", payload);
      alert("Movie created");
      setForm({ title: "", genres: "", releaseYear: "", director: "", synopsis: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const deleteMovie = async (id) => {
    if (!confirm("Delete movie?")) return;
    try {
      await client.delete("/movies/" + id);
      load();
    } catch (e) { alert("Failed"); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Create Movie</h3>
        <form onSubmit={createMovie} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="p-2 border rounded" required />
          <input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Genres (comma separated)" className="p-2 border rounded" />
          <input value={form.releaseYear} onChange={(e) => setForm({ ...form, releaseYear: e.target.value })} placeholder="Year" className="p-2 border rounded" />
          <input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} placeholder="Director" className="p-2 border rounded" />
          <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} placeholder="Synopsis" className="p-2 border rounded md:col-span-2" />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
            <button type="button" onClick={() => setForm({ title: "", genres: "", releaseYear: "", director: "", synopsis: "" })} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Movies</h3>
        <div className="grid gap-3">
          {movies.map((m) => (
            <div key={m._id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-semibold">{m.title}</div>
                <div className="text-sm text-gray-500">{m.genres?.join(", ")}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteMovie(m._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Users</h3>
        <div className="grid gap-2">
          {users.length === 0 && <div className="text-sm text-gray-500">No user list endpoint available</div>}
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-2 border rounded">
              <div>{u.username} ({u.email})</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
