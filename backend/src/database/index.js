import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    return connectionInstance;
  } catch (error) {
    console.log("Error:: database->index.js:: ", error);
    process.exit(1);
  }
};

export default connectDB;
