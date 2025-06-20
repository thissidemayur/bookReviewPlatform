import dotenv from "dotenv";

dotenv.config({ path: "./.env" }); //use to load env variable into process.env

// ----------------------- MongoDB Configuration -----------------------
const MONGODB_URI = process.env.MONGODB_URI;

// ----------------------- Server Configuration -----------------------
const PORT = parseInt(process.env.PORT) || 2000;

// ----------------------- Cloudinary Configuration -----------------------
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECREAT = process.env.CLOUDINARY_API_SECREAT;

// ----------------------- JWT & Auth Configuration -----------------------
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

// ----------------------- Bcrypt Configuration -----------------------
const BCRYPT_SALT_ROUND = parseInt(process.env.BCRYPT_SALT_ROUND);
console.log(typeof BCRYPT_SALT_ROUND);

export {
  // MongoDB
  MONGODB_URI,

  // Server
  PORT,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECREAT,

  //JWT Auth
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,

  // Bcrypt
  BCRYPT_SALT_ROUND,
};
