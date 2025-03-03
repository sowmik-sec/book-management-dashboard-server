import { model, Schema, Types } from "mongoose";
import { BookFormat } from "./book.constant";
import { TBook, TGenre } from "./book.interface";

const genreSchema = new Schema<TGenre>(
  {
    genre: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const bookSchema = new Schema<TBook>(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      // required: true,
      // match: [/^(?:\d-?){9}[\dX]$/, "Invalid ISBN format"],
    },
    language: {
      type: String,
      required: true,
    },
    series: {
      type: String,
    },
    genres: {
      type: [genreSchema],
      required: true,
      validate: [
        {
          validator: (genres: TGenre[]) => genres.length > 0,
          message: "At least one genre required",
        },
      ],
    },
    format: {
      type: String,
      required: true,
      enum: Object.values(BookFormat),
    },
    pageCount: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<TBook>("Book", bookSchema);
