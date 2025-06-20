import mongoose, { model, Schema } from "mongoose";
import {
  BCRYPT_SALT_ROUND,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
} from "../config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "password is must"],
    },
    userImg: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    userNameChangeCount: {
      type: Number,
      default: 0,
      max: 2,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// virtual field to set full Name:
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/*
convert password into hash password using-> bcrypt
validate password using bcrypt.compare() by creating schema level method
*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUND);
  next();
});

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/*
genereate access token-> for auth
genreate refresh token-> to renew access token
add both genereteAccessToken and genereateRefreshToken in user schema level
*/
userSchema.methods.generateAccessToken = function () {
  const userObject = this.toObject({ virtuals: true });
  return jwt.sign(
    {
      data: {
        fullName: userObject.fullName,
        userName: userObject.userName,
        email: userObject.email,
        userImg: userObject.userImg,
        _id: userObject._id,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      data: {
        _id: this._id,
      },
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

const User = model("User", userSchema);
export default User;
