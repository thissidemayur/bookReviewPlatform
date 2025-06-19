import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Title is required!"],
    },
    author: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Author is required!"],
    },
    genre: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Genre is required!"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Summary is required!"],
    },
    publishDate: {
      type: Date,
      required: [true, "Publish Date is required!"],
    },
    language: {
      type: String,
      required: [true, "Language is required!"],
      trim: true,
    },
    coverImage: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Book = model("Book", bookSchema);
export default Book;
