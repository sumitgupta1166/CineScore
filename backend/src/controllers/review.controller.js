import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Movie } from "../models/movie.model.js";
import mongoose from "mongoose";
import { recalcMovieRatings } from "../services/rating.service.js";

const getReviewsForMovie = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(movieId)) throw new ApiError(400, "Invalid movie id");
  const reviews = await Review.find({ movie: movieId }).populate("user", "username profilePicture");
  return res.status(200).json(new ApiResponse(200, reviews, "Movie reviews"));
});

const createReview = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user._id;
  const { rating, text } = req.body;
  if (!rating || rating < 1 || rating > 5) throw new ApiError(400, "Rating must be 1-5");

  if (!mongoose.Types.ObjectId.isValid(movieId)) throw new ApiError(400, "Invalid movie id");
  const movie = await Movie.findById(movieId);
  if (!movie) throw new ApiError(404, "Movie not found");

  // upsert: one review per user per movie
  const review = await Review.findOneAndUpdate({ user: userId, movie: movieId }, { $set: { rating, text, updatedAt: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await recalcMovieRatings(movieId);
  return res.status(201).json(new ApiResponse(201, review, "Review saved"));
});

const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(reviewId)) throw new ApiError(400, "Invalid review id");

  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");
  if (!review.user.equals(userId) && req.user.role !== "admin") throw new ApiError(403, "Not authorized to update this review");

  review.rating = req.body.rating ?? review.rating;
  review.text = req.body.text ?? review.text;
  review.updatedAt = new Date();
  await review.save();

  await recalcMovieRatings(review.movie);
  return res.status(200).json(new ApiResponse(200, review, "Review updated"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(reviewId)) throw new ApiError(400, "Invalid review id");

  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");
  if (!review.user.equals(userId) && req.user.role !== "admin") throw new ApiError(403, "Not authorized to delete this review");

  await Review.findByIdAndDelete(reviewId);
  await recalcMovieRatings(review.movie);
  return res.status(200).json(new ApiResponse(200, null, "Review deleted"));
});

export { getReviewsForMovie, createReview, updateReview, deleteReview };
