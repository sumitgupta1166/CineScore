import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import moviesRouter from "./routes/movies.route.js";
import reviewsRouter from "./routes/reviews.route.js";
import usersRouter from "./routes/users.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// app.use(cors({ origin: "*", credentials: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json({ limit: "128kb" }));
app.use(express.urlencoded({ extended: true, limit: "128kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// basic rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1", reviewsRouter);
app.use("/api/v1/users", usersRouter);

app.get("/api/v1/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export { app };
