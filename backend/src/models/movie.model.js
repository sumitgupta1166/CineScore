import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  genres: [{ type: String }],
  releaseYear: Number,
  director: String,
  cast: [{ name: String, role: String }],
  synopsis: String,
  posterUrl: String,
  trailerUrl: String,
  averageRating: { type: Number, default: 0 }, // precomputed for quick reads
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// text index for search
movieSchema.index({ title: "text", synopsis: "text", director: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
