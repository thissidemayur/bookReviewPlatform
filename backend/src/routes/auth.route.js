import express from "express";
import {
  forgetPassword,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").post(authUser, logout);
authRouter.route("/forgot-password").post(forgetPassword);
authRouter.route("/refresh-token").post(refreshAccessToken);

export default authRouter;
