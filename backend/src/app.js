import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.route.js";
import reviewRouter from "./routes/review.route.js";

const corsOptions = {
  origin: "http://localhost.5173",
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Namashkar brahmhand from thissidemayur!!");
});

// router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/review", reviewRouter);

export { app };
