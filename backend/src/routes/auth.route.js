import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { checkValidation } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register",
  [ body("username").isLength({ min: 3 }), body("email").isEmail(), body("password").isLength({ min: 6 }) ],
  checkValidation,
  register
);

router.post("/login", [ body("email").isEmail(), body("password").exists() ], checkValidation, login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;
