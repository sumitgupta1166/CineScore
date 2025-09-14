import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { Movie } from "../models/movie.model.js";
import mongoose from "mongoose";

const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid user id");
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  const reviews = await Review.find({ user: id }).populate("movie", "title posterUrl averageRating");
  return res.status(200).json(new ApiResponse(200, { user, reviews }, "User profile"));
});

const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!req.user._id.equals(id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized to update profile");
  const payload = req.body;
  const user = await User.findByIdAndUpdate(id, payload, { new: true }).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "User updated"));
});

// watchlist stored as array of objects on user document for simplicity
const getWatchlist = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!req.user._id.equals(id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized to view watchlist");
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  // let's store watchlist in a subdocument `watchlist` on user in seed; for now, assume user.watchlist holds movie ids
  await user.populate({ path: "watchlist.movie", model: Movie });
  return res.status(200).json(new ApiResponse(200, user.watchlist || [], "Watchlist"));
});

const addToWatchlist = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { movieId } = req.body;
  if (!req.user._id.equals(id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  if (!user.watchlist) user.watchlist = [];
  // prevent duplicates
  if (user.watchlist.some((w) => w.movie?.toString() === movieId)) {
    return res.status(200).json(new ApiResponse(200, user.watchlist, "Already in watchlist"));
  }
  user.watchlist.push({ movie: movieId, dateAdded: new Date() });
  await user.save();
  return res.status(201).json(new ApiResponse(201, user.watchlist, "Added to watchlist"));
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const movieId = req.params.movieId;
  if (!req.user._id.equals(id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  user.watchlist = (user.watchlist || []).filter((w) => w.movie?.toString() !== movieId);
  await user.save();
  return res.status(200).json(new ApiResponse(200, user.watchlist, "Removed from watchlist"));
});

export { getUserProfile, updateUser, getWatchlist, addToWatchlist, removeFromWatchlist };
