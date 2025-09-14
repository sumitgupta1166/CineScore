import { Review } from "../models/review.model.js";
import { Movie } from "../models/movie.model.js";

const recalcMovieRatings = async (movieId) => {
  // aggregate average and count
  const result = await Review.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: "$movie",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);
  if (result.length === 0) {
    // no reviews
    await Movie.findByIdAndUpdate(movieId, { averageRating: 0, ratingCount: 0 });
  } else {
    const { avgRating, count } = result[0];
    await Movie.findByIdAndUpdate(movieId, { averageRating: Math.round(avgRating * 10) / 10, ratingCount: count });
  }
};

export { recalcMovieRatings };
