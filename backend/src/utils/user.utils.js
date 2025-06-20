import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.utils.js";

// ---------------------------Helper function for User controller-------------------

// genereate access and refresh token
async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(
        "User not found while generating the JWT tokens @ generateAccessAndRefreshToken::"
      );
      throw new ApiError(400, "user not found");
    }

    const refreshToken = await user.generateRefreshToken();

    const accessToken = await user.generateAccessToken();

    if (!refreshToken) {
      console.error(
        "error while genereating refresh token @  generateAccessAndRefreshToken:: "
      );
      throw new ApiError(500, "error while genereating refresh token");
    }
    if (!accessToken) {
      console.error(
        "error while genereating access token @  generateAccessAndRefreshToken:: "
      );
      throw new ApiError(500, "error while genereating access token");
    }

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.error(
      "error while genereating refresh token @  generateAccessAndRefreshToken:: =",
      error?.message || error
    );
    throw new ApiError(500, "Error while genreating tokens");
  }
}

//

// cookie option
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export { cookieOptions, generateAccessAndRefreshToken };
