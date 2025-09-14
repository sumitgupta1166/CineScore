import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signAccessToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
  });
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) throw new ApiError(400, "username, email and password are required");
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new ApiError(409, "User with same email or username exists");
  const user = new User({ username, email, password });
  await user.save();
  return res.status(201).json(new ApiResponse(201, { id: user._id }, "User registered"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password required");
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password))) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken, user: { _id: user._id, username: user.username, email: user.email } }, "Logged in"));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken || req.header("x-refresh-token");
  if (!token) throw new ApiError(401, "Refresh token required");
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token) throw new ApiError(401, "Invalid refresh token");

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Token refreshed"));
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const logout = asyncHandler(async (req, res) => {
  // invalidate refresh token on server and clear cookies
  const token = req.cookies?.refreshToken || req.body.refreshToken || req.header("x-refresh-token");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded._1d || decoded._id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    } catch (e) {
      // ignore
    }
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, null, "Logged out"));
});

export { register, login, refresh, logout };
