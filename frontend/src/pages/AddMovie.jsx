// src/pages/AddMovie.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../lib/api";

export default function AddMovie() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    genres: "",
    releaseYear: "",
    director: "",
    synopsis: "",
    posterUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        genres: form.genres.split(",").map((g) => g.trim()),
      };
      await client.post("/movies", payload);
      alert("✅ Movie added successfully!");
      navigate("/movies");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to add movie");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="genres"
          value={form.genres}
          onChange={handleChange}
          placeholder="Genres (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="releaseYear"
          value={form.releaseYear}
          onChange={handleChange}
          placeholder="Release Year"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="director"
          value={form.director}
          onChange={handleChange}
          placeholder="Director"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="synopsis"
          value={form.synopsis}
          onChange={handleChange}
          placeholder="Synopsis"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="posterUrl"
          value={form.posterUrl}
          onChange={handleChange}
          placeholder="Poster URL"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Save Movie
        </button>
      </form>
    </div>
  );
}
