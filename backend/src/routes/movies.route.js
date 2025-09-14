import { Router } from "express";
import { createMovie, listMovies, getMovie, deleteMovie } from "../controllers/movie.controller.js";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import { checkValidation } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/", listMovies);
router.get("/:id", getMovie);
router.post("/", verifyJWT, requireAdmin, [ body("title").notEmpty() ], checkValidation, createMovie);
router.delete("/:id", verifyJWT, requireAdmin, deleteMovie);

export default router;
