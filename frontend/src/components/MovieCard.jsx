// src/components/MovieCard.jsx (swap in this content)
import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      <div className="relative pb-[150%] overflow-hidden rounded-md bg-gray-100">
        {movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>}
      </div>
      <div className="mt-3 flex-1 flex flex-col">
        <Link to={`/movies/${movie._id}`} className="text-lg font-semibold hover:underline">{movie.title}</Link>
        <div className="text-sm text-gray-500 mt-1">{movie.genres?.join(", ")} • {movie.releaseYear}</div>
        <div className="mt-2 text-sm text-gray-700 line-clamp-3">{movie.synopsis}</div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">⭐ {movie.averageRating ?? 0} ({movie.ratingCount ?? 0})</div>
          <Link to={`/movies/${movie._id}`} className="text-indigo-600 text-sm">View</Link>
        </div>
      </div>
    </div>
  );
}
