import { asyncHandler } from "../utils/asynchHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config.js";
import User from "../model/user.model.js";

export const authUser = asyncHandler(async (req, _, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.header?.authorization?.replace("Bearer ", "");

    const token = cookieToken || headerToken;
    if (!token || typeof token !== "string") {
      console.error("unauthorise user as access token not found");
      throw new ApiError(401, "unauthorized user!");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(404, "User not found");

    req.authUser = user;
    next();
  } catch (error) {
    console.error("error @authUser middleware:: = ", error?.message || error);
    throw new ApiError(401, " unauthorized user!");
  }
});
