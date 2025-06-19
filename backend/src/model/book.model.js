import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Title is required!"],
      index: true,
    },
    author: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Author is required!"],
      index: true,
    },
    genre: {
      type: String,
      tolower: true,
      trim: true,
      required: [true, "Genre is required!"],
      index: true,
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

bookSchema.index({ title: 1, genre: 1 });
bookSchema.index({ title: 1, author: 1 });

const Book = model("Book", bookSchema);
export default Book;
