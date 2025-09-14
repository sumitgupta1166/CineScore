import { Router } from "express";
import { getUserProfile, updateUser, getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id", getUserProfile);
router.put("/:id", verifyJWT, updateUser);

router.get("/:id/watchlist", verifyJWT, getWatchlist);
router.post("/:id/watchlist", verifyJWT, addToWatchlist);
router.delete("/:id/watchlist/:movieId", verifyJWT, removeFromWatchlist);

export default router;
