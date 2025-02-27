import { BookFormat } from "./book.constant";

export type TBook = {
  name: string;
  price: number;
  quantity: number;
  releaseDate: Date;
  author: string;
  isbn?: string;
  genre: string[];
  publisher: string;
  series?: string;
  language: string;
  format: BookFormat;
  pageCount: number;
};
