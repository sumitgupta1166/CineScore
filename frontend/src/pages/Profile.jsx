// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../lib/api";
import MovieCard from "../components/MovieCard";

export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    client.get("/users/" + id).then((r) => setUserData(r.data.data)).catch(() => {});
  }, [id]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden">{userData.user.profilePicture ? <img src={userData.user.profilePicture} /> : <div className="p-6 text-gray-400">No Image</div>}</div>
        <div>
          <h2 className="text-2xl font-bold">{userData.user.username}</h2>
          <div className="text-sm text-gray-500">Joined: {new Date(userData.user.joinDate).toLocaleDateString()}</div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold">Your Reviews</h3>
        <div className="grid gap-4 mt-3">
          {userData.reviews.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.movie?.title}</div>
                <div>⭐ {r.rating}</div>
              </div>
              <p className="mt-2 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Watchlist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {(userData.user.watchlist || []).map((w) => (w.movie ? <MovieCard key={w.movie._id} movie={w.movie} /> : null))}
        </div>
      </section>
    </div>
  );
}
