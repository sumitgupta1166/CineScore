import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Movie } from "../models/movie.model.js";
import mongoose from "mongoose";

const createMovie = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.title) throw new ApiError(400, "title is required");
  const movie = await Movie.create(payload);
  return res.status(201).json(new ApiResponse(201, movie, "Movie created"));
});

// GET /movies?search=&genre=&year=&minRating=&page=&limit=
const listMovies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, parseInt(req.query.limit || "10", 10));
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.genre) filters.genres = { $in: [new RegExp(`^${req.query.genre}$`, "i")] };
  if (req.query.year) filters.releaseYear = parseInt(req.query.year, 10);
  if (req.query.minRating) filters.averageRating = { $gte: parseFloat(req.query.minRating) };

  if (req.query.search) {
    filters.$text = { $search: req.query.search };
  }

  const total = await Movie.countDocuments(filters);
  const movies = await Movie.find(filters).skip(skip).limit(limit).sort({ averageRating: -1, createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, { data: movies, page, limit, total }, "Movies list"));
});

const getMovie = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid movie id");
  const movie = await Movie.findById(id);
  if (!movie) throw new ApiError(404, "Movie not found");
  return res.status(200).json(new ApiResponse(200, movie, "Movie found"));
});

const deleteMovie = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid movie id");
  const movie = await Movie.findByIdAndDelete(id);
  if (!movie) throw new ApiError(404, "Movie not found");
  return res.status(200).json(new ApiResponse(200, movie, "Movie deleted"));
});

export { createMovie, listMovies, getMovie, deleteMovie };
