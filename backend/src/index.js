import { app } from "./app.js";
import dotenv from "dotenv";
import { PORT } from "./config.js";
import connectDB from "./database/index.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ server is connected on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Mongodb DB connection fail");
    throw new Error(error);
  });
