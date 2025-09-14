import { Router } from "express";
import { getReviewsForMovie, createReview, updateReview, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/movies/:id/reviews", getReviewsForMovie);
router.post("/movies/:id/reviews", verifyJWT, createReview);
router.put("/reviews/:reviewId", verifyJWT, updateReview);
router.delete("/reviews/:reviewId", verifyJWT, deleteReview);

export default router;
