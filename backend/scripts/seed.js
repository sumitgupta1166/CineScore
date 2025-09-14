import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "../src/db/index.js";
import { User } from "../src/models/user.model.js";
import { Movie } from "../src/models/movie.model.js";
import { Review } from "../src/models/review.model.js";

const run = async () => {
  try {
    await connectDB();

    // create admin
    await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { username: "admin", email: "admin@example.com", password: "AdminPass123!", role: "admin" },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // create user
    await User.findOneAndUpdate(
      { email: "joe@example.com" },
      { username: "joe", email: "joe@example.com", password: "UserPass123!" },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // sample movies
    const movies = [
      { title: "The Example Movie", genres: ["Drama"], releaseYear: 2021, director: "Jane Doe", synopsis: "Sample synopsis", posterUrl: "", trailerUrl: "" },
      { title: "Action Blast", genres: ["Action"], releaseYear: 2019, director: "John Smith", synopsis: "Action-packed", posterUrl: "", trailerUrl: "" }
    ];

    for (const m of movies) {
      await Movie.findOneAndUpdate({ title: m.title }, { $set: m }, { upsert: true });
    }

    console.log("Seed completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
