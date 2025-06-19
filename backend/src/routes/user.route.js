import express from "express";

const userRouter = express.Router();

userRouter.get("/test", (req, res) => {
  console.log("test is running");
  res.send("User route working!");
});

export default userRouter;
