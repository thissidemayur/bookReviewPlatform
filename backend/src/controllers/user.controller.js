import { asyncHandler } from "../utils/asynchHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { uploadSingleImageOnCloudinary } from "../utils/cloudinary.utils.js";
import {
  cookieOptions,
  generateAccessAndRefreshToken,
} from "../utils/user.utils.js";

import User from "../model/user.model.js";
import { REFRESH_TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

// register new user
const registerUser = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password, userName } = req.body;
    firstName = lastName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    userName = userName.trim();
    if (!firstName) throw new ApiError(400, "first name is required!");
    if (!lastName) throw new ApiError(400, "last name is required!");
    if (!password) throw new ApiError(400, "password is required!");
    if (!email && !userName)
      throw new ApiError(400, "Please provide either an email or a username!");

    const existedUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existedUser) {
      console.error("User already existed");
      throw new ApiError(
        400,
        "A user with this email or username already exists."
      );
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      userName,
      password,
    });

    if (!newUser)
      throw new ApiError(
        500,
        `There was an issue creating ${newUser.firstName} account`
      );

    const newUserDetail = await User.findById(newUser._id, { password: 0 });
    if (!newUserDetail)
      throw new ApiError(
        500,
        `An error occurred while retrieving ${newUser.firstName} details.`
      );

    const userResponse = newUserDetail.toObject();
    delete userResponse.password;

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newUserDetail,
          `User: ${newUserDetail.fullName} has been successfully created!`
        )
      );
  } catch (error) {
    console.error("Error @ registerUser:: = ", error);
    throw new ApiError(
      500,
      "User not created , Please try again after sometime!"
    );
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!password) throw new ApiError(400, "password is required!");
    if (!email && !userName)
      throw new ApiError(400, "Please provide either an email or a username!");

    const user = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (!user) throw new ApiError(400, "User not found");

    const verifyPassword = await user.validatePassword(password);
    if (!verifyPassword) throw new ApiError(400, "wrong password");

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id
    );

    //   convert mongo db docs to js's object
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(new ApiResponse(200, userResponse, "login successfully!"));
  } catch (error) {
    console.error("Error @ loginUser:: = ", error?.message || error);
    throw new ApiError(
      "Something went wrone while loging in please try again later"
    );
  }
});

// logout
const logout = asyncHandler(async (req, res) => {
  try {
    const userId = req?.authUser?._id;
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { returnDocument: "after" }
    );

    return res
      .status(200)
      .cookie("refreshToken", cookieOptions)
      .cookie("accessToken", cookieOptions)
      .json(new ApiResponse(200, {}, "logout successfully"));
  } catch (error) {
    console.error("Error @logout:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while logging out. Please try again later."
    );
  }
});

// update user password
const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      console.error("Password fields missing @updateCurrentPassword");
      throw new ApiError(400, "Both old and new passwords are required.");
    }
    const trimOldPassword = oldPassword.trim();
    const trimNewPassword = newPassword.trim();
    const userId = req?.authUser?._id;
    const user = await User.findById(userId);
    if (!user) {
      console.error("user not found @updateCurrentPassword:: =  ");

      throw new ApiError(
        404,
        "User not found. Please verify your login session."
      );
    }

    const checkPassword = await user.validatePassword(trimOldPassword);
    if (!checkPassword) {
      console.error("incorrect password @updateCurrentPassword:: =  ");
      throw new ApiError(400, "Incorrect old password. Please try again.");
    }

    user.password = trimNewPassword;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "password change successFully!"));
  } catch (error) {
    console.error("Error @updateCurrentPassword:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while updating the password. Please try again later."
    );
  }
});

// update user password
const forgetPassword = asyncHandler(async (req, res) => {
  try {
    // const { ,  } = req.query;
    const { newPassword, userName, email } = req.body;

    if (!userName && !email) {
      console.error("userName or email not provided @forgetPassword");
      throw new ApiError(
        400,
        "Please provide either a userName or email to reset the password."
      );
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });
    if (!user) {
      console.error("user not found @forgetPassword:: =  ");

      throw new ApiError(
        404,
        "No user found with the provided username or email."
      );
    }
    /*******************  TODO:
     * Use OTP authentication before saving newPassword 
     * verify OTP authenticaton 
     * after successfull OTP verificaiton now user have privileage to change password;
    
     * ********************/
    console.log("TODO-> implies otp verifcation");
    const otpValid = true;
    if (!otpValid) {
      console.error("invalid OTP @forgetPassword:: =  ");
      throw new ApiError(400, "Invalid OTP. Please try again.");
    }
    // let suppose otp verficaiton is successfull
    if (!newPassword) {
      console.error("new password is empty ");
      throw new ApiError(400, "new password is required");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(201, {}, "password change successFully!"));
  } catch (error) {
    console.error("Error @forgetPassword:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while resetting the password. Please try again later."
    );
  }
});

//get  user
const getUser = asyncHandler(async (req, res) => {
  try {
    const { userName } = req.params;
    if (!userName) {
      console.error("userName is not provied @getCurrentUser :: ");
      throw new ApiError(400, "User ID is required to fetch the current user.");
    }
    const user = await User.findOne({ userName }).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.error("user not found @ getCurrentUser");
      throw new ApiError(
        404,
        "User not found. Please check the user ID and try again."
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user reterive successfully"));
  } catch (error) {
    console.error("Error @ getCurrentUser:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while fetching user details. Please try again later."
    );
  }
});

// update profile
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, userName } = req.body;
    if (!firstName && !lastName && !email && !userName) {
      console.error("all fields are missing @updateProfile");
      throw new ApiError(
        400,
        "At least one field (firstName, lastName, email, or userName) is required for profile update."
      );
    }

    const userId = req?.authUser?._id;
    const user = await User.findById(userId);
    if (!user) {
      console.error("user not found @updateProfile:: =  ");

      throw new ApiError(
        404,
        "User not found. Please verify your login session."
      );
    }
    if (userName && user.userNameChangeCount >= 1) {
      console.error("userName change request exceed @updateProfile:: =  ");
      throw new ApiError(
        400,
        "Username change limit exceeded. You cannot change your username more than once."
      );
    }

    if (firstName && firstName !== user.firstName) user.firstName = firstName;
    if (lastName && lastName !== user.lastName) user.lastName = lastName;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error("email address is already in use  @updateProfile:: =  ");
        throw new ApiError(
          409,
          "Email address already in use. Please use a different email address."
        );
      }
      user.email = email;
    }

    if (userName && userName !== user.userName) {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        console.error(`${userName} is already in use  @updateProfile:: =  `);
        throw new ApiError(
          409,
          "Username already in use. Please choose a different username."
        );
      }
      user.userName = userName;
    }

    await user.save({ validateBeforeSave: false });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res
      .status(200)
      .json(
        new ApiResponse(200, userResponse, "password change successFully!")
      );
  } catch (error) {
    console.error("Error @updateProfile:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while updating Profile details. Please try again later."
    );
  }
});

// upload user image
const uploadUserImg = asyncHandler(async (req, res) => {
  try {
    const localFilePath = req?.file?.path;

    if (!localFilePath) {
      console.error("user doesnot sent user image  @uploadUserImg:: =  ");

      throw new ApiError(
        400,
        "No profile image provided. Please upload an image."
      );
    }

    const cloudnaryImg = await uploadSingleImageOnCloudinary(localFilePath);

    if (!cloudnaryImg.secure_url) {
      console.error(
        "upload image failed cloudinary responese  @uploadUserImg:: =  "
      );
      throw new ApiError(500, "Image upload failed. Please try again later.");
    }

    const user = await User.findByIdAndUpdate(
      req?.authUser?._id,
      {
        $set: {
          userImg: cloudnaryImg.secure_url,
        },
      },
      {
        returnDocument: "after",
      }
    );

    delete user.password;
    delete user.refreshToken;

    return res
      .status(200)
      .json(new ApiResponse(201, user, "upload user image successfully"));
  } catch (error) {
    console.error("Error @uploadUserImg:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while uploading your profile image. Please try again later."
    );
  }
});

// update userImge
const updateUserImg = asyncHandler(async (req, res) => {
  try {
    const localFilePath = req?.file?.path;
    if (!localFilePath) {
      console.error("user doesnot sent user image  @updateUserImg:: =  ");

      throw new ApiError(
        400,
        "No new profile image provided. Please upload an image."
      );
    }

    /********** TODO: Delete previous image at Cloudinary  ***********
     * 
     console.error("Failed to delete previous image from Cloudinary.");
    
     throw new ApiError(500, "Failed to delete the previous image. Please try again later.");

     */

    const cloudnaryImg = await uploadSingleImageOnCloudinary(localFilePath);

    if (!cloudnaryImg.secure_url) {
      console.error(
        "upload image failed cloudinary responese  @updateUserImg:: =  "
      );
      throw new ApiError(
        500,
        "Failed to upload the image. Please try again later."
      );
    }

    const user = await User.findByIdAndUpdate(
      req?.authUser?._id,
      {
        $set: {
          userImg: cloudnaryImg.secure_url,
        },
      },
      {
        returnDocument: "after",
      }
    );

    delete user.password;
    delete user.refreshToken;

    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User Profile image updated successfully")
      );
  } catch (error) {
    console.error("Error @updateUserImg:: = ", error?.message || error);
    throw new ApiError(
      500,
      "An error occurred while updating your profile image. Please try again later."
    );
  }
});

// delete user by itself
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req?.authUser?._id;
    if (!userId) {
      console.error("token expires @deleteUser:: = ");
      throw new ApiError(
        401,
        "Authentication failed. Please log in to delete your account."
      );
    }

    if (!password) {
      console.error("Password fields missing @deleteUser");
      throw new ApiError(400, "Password is required to delete your account.");
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("user not found @deleteUser:: =  ");

      throw new ApiError(
        404,
        "User not found. Please verify your login session."
      );
    }

    const checkPassword = await user.validatePassword(password);
    if (!checkPassword) {
      console.error("incorrect password @deleteUser:: =  ");
      throw new ApiError(400, "Incorrect password. Please try again.");
    }
    const deletedUser = await user.deleteOne();
    if (deletedUser.deletedCount === 0) {
      console.error("user is not delted from mongodb DB @deleteUser:: =  ");
      throw new ApiError(
        500,
        "Something went wrong while deleting your account. Please try again later."
      );
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "user deleted successfully!"));
  } catch (error) {
    console.error("Error @deleteUser:: = ", error || error?.message);
    throw new ApiError(
      500,
      "An error occurred while deleting your account. Please try again later."
    );
  }
});

// genereate refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      console.error("No refresh token provided @refreshAccessToken:: = ");
      throw new ApiError(401, "Please log in again to refresh your session.");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.data?._id).select(
      "-password "
    );
    if (!user) {
      throw new ApiError(
        404,
        "We couldn't find your account. Please log in again."
      );
    }

    // Check if the refresh token matches
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Your session has expired. Please log in again.");
    }

    // Generate new access and refresh tokens
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id
    );
    // Send the new tokens in ,the response
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: refreshToken },
          "Access token refreshed successfully!"
        )
      );
  } catch (error) {
    console.error("Error @refreshAccessToken:: = ", error?.message || error);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "An unexpected error occurred. Please try again."
    );
  }
});

export {
  registerUser,
  loginUser,
  logout,
  updatePassword,
  forgetPassword,
  getUser,
  updateProfile,
  uploadUserImg,
  updateUserImg,
  deleteUser,
  refreshAccessToken,
};
