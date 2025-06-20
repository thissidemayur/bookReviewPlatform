import express from "express";
import {
  deleteUser,
  getUser,
  updatePassword,
  updateProfile,
  updateUserImg,
  uploadUserImg,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = express.Router();

userRouter.route("/update-password").post(authUser, updatePassword);
userRouter.route("/profile").post(authUser, updateProfile);
userRouter
  .route("/upload-image")
  .post(upload.single("image"), authUser, uploadUserImg);
userRouter
  .route("/update-image")
  .post(upload.single("image"), authUser, updateUserImg);
userRouter.route("/delete").delete(authUser, deleteUser);

userRouter.route("/profile/:userName").get(getUser);

export default userRouter;
