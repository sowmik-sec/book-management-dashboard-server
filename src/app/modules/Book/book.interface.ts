import { Types } from "mongoose";
import { BookFormat } from "./book.constant";

export type TGenre = {
  genre: string;
  isDeleted: boolean;
};

export type TBook = {
  name: string;
  price: number;
  quantity: number;
  releaseDate: Date;
  author: string;
  isbn?: string;
  genres: [TGenre];
  publisher: string;
  series?: string;
  language: string;
  format: BookFormat;
  pageCount: number;
  createdBy: Types.ObjectId;
};
