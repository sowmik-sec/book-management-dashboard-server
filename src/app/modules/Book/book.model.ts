import { model, Schema, Types } from "mongoose";
import { BookFormat } from "./book.constant";
import { TBook } from "./book.interface";

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
    genre: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (genres: string[]) => genres.length > 0,
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
