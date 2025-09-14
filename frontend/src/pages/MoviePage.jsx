// src/pages/MoviePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../lib/api";
import ReviewForm from "../components/ReviewForm";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const load = async () => {
    try {
      const res = await client.get("/movies/" + id);
      setMovie(res.data.data);
      const r = await client.get(`/movies/${id}/reviews`);
      setReviews(r.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, [id]);

  const removeReview = async (reviewId) => {
    if (!confirm("Delete review?")) return;
    try {
      await client.delete(`/reviews/${reviewId}`);
      load();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const deleteMovie = async () => {
    if (!confirm("Delete movie?")) return;
    try {
      await client.delete(`/movies/${id}`);
      alert("Deleted");
      window.location.href = "/movies";
    } catch (e) {
      alert("Failed");
    }
  };

  return (
    <div className="space-y-6">
      {movie && (
        <div className="bg-white rounded p-6 shadow flex gap-6">
          <div className="w-48 h-64 rounded overflow-hidden bg-gray-100 flex-shrink-0">
            {movie.posterUrl ? <img src={movie.posterUrl} className="w-full h-full object-cover" /> : <div className="p-4 text-gray-400">No image</div>}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="text-sm text-gray-500">{movie.genres?.join(", ")} • {movie.releaseYear}</div>
            <p className="mt-4">{movie.synopsis}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={async () => {
                const uid = userId || prompt("Login required. Enter user id for quick test:");
                if (!uid) return;
                await client.post(`/users/${uid}/watchlist`, { movieId: id });
                alert("Added");
              }}>Add to Watchlist</button>

              {role === "admin" && <button onClick={deleteMovie} className="px-4 py-2 bg-red-600 text-white rounded">Delete Movie</button>}
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="space-y-4 mt-4">
          {reviews.length === 0 && <div className="text-gray-500">No reviews yet — be the first!</div>}
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">{r.user?.username || "Unknown"}</div>
                <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                <div className="mt-2">{r.text}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-medium">⭐ {r.rating}</div>
                {(r.user?._id === userId || role === "admin") && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => removeReview(r._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Leave a review</h3>
          <ReviewForm movieId={id} onSuccess={load} />
        </div>
      </section>
    </div>
  );
}
