// Require the cloudinary library
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECREAT,
  CLOUDINARY_CLOUD_NAME,
} from "../config";
import { ApiError } from "./apiError.utils.js";
import fs from "fs/promises";
// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECREAT,
});

// Log the configuration
console.log(cloudinary.config());

/**
 * Uploads a single image to Cloudinary and removes the local  file. present at /backend/public/temp/
 * @param {string} localFilePath - Path to the local image file.
 * @returns {Promise<object>} - Cloudinary response containing file details.
 * @throws {ApiError} - On upload or cleanup failure.
 */
export const uploadSingleImageOnCLoudinary = async (localfilePath) => {
  try {
    if (!localfilePath)
      throw new ApiError(400, "No file path provided for upload.");

    const cloudinaryResponse = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "image",
    });
    if (!cloudinaryResponse) {
      console.error(" Upload failed: Empty response received");
      throw new ApiError(500, "image does not uploaded try again later");
    }
    await fs.unlink(localfilePath);

    return cloudinaryResponse;
  } catch (error) {
    try {
      await fs.unlink(localfilePath);
    } catch (cleanupError) {
      console.error(
        "[uploadSingleImageOnCLoudinary] Failed to delete temp file",
        cleanupError
      );
    }

    console.error(
      "[uploadSingleImageOnCLoudinary]: Error during upload:",
      error?.message || error
    );
    throw new ApiError(
      500,
      "Unexpected error during image upload",
      error.stack
    );
  }
};
