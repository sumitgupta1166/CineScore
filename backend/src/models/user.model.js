import mongoose from "mongoose";
import bcrypt from "bcrypt";

const watchlistSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  dateAdded: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profilePicture: String,
  joinDate: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshToken: String,
  watchlist: [watchlistSchema]   // ✅ FIX: add watchlist schema here
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
