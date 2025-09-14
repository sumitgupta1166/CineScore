// src/pages/Movies.jsx
import React, { useEffect, useState } from "react";
import client from "../lib/api";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [minRating, setMinRating] = useState("");
  const [limit] = useState(12);
  const userRole = localStorage.getItem("role");

  const load = async () => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (query) params.append("search", query);
      if (genre) params.append("genre", genre);
      if (minRating) params.append("minRating", minRating);
      const res = await client.get("/movies?" + params.toString());
      setMovies(res.data.data.data);
    } catch (e) {
      setMovies([]);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <form onSubmit={onSearch} className="md:col-span-2 flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies, director, synopsis..." className="flex-1 p-2 rounded border" />
          <button className="px-4 py-2 rounded bg-indigo-600 text-white">Search</button>
        </form>
        <div className="flex gap-2">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="p-2 border rounded">
            <option value="">All Genres</option>
            <option>Action</option>
            <option>Drama</option>
            <option>Comedy</option>
            <option>Thriller</option>
          </select>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="p-2 border rounded">
            <option value="">Any rating</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          {userRole === "admin" && (
            <Link to="/admin" className="px-4 py-2 bg-green-600 text-white rounded">Go to Admin Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded">Prev</button>
          <div>Page {page}</div>
          <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
