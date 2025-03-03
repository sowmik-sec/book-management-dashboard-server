export enum BookFormat {
  Hardcover = "hardcover",
  Paperback = "paperback",
  EBook = "e-book",
  Audiobook = "audiobook",
}

export const bookSearchableFields = [
  "name",
  "author",
  "isbn",
  "publisher",
  "series",
  "language",
  "format",
];

import { FilterQuery, Query } from "mongoose";
import { TBook } from "./book.interface"; // Adjust path

// Define a type for Mongoose regex conditions
type RegexCondition = { $regex: string; $options: string };

// Define the filter query type
export interface BookFilterQuery {
  searchTerm?: string;
  sort?: string;
  limit?: string | number;
  page?: string | number;
  fields?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  startDate?: string | Date;
  endDate?: string | Date;
  author?: string | RegexCondition;
  isbn?: string;
  genre?: string;
  publisher?: string | RegexCondition;
  series?: string | RegexCondition;
  language?: string | RegexCondition;
  format?: string;
  minPageCount?: string | number;
  maxPageCount?: string | number;
  price?: { $gte?: number; $lte?: number };
  releaseDate?: { $gte?: Date; $lte?: Date };
  pageCount?: { $gte?: number; $lte?: number };
  "genres.genre"?: { $in: string[] } | { $regex: RegExp };
  [key: string]: any; // Flexibility for additional fields
}
