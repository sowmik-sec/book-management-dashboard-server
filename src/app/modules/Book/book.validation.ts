import { z } from "zod";
import { BookFormat } from "./book.constant";

const createBookValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Book name is required"),
    author: z.string().min(1, "Author name is required"),
    price: z.number().min(0, "Price must be ≥ 0"),
    releaseDate: z.date().or(z.string().pipe(z.coerce.date())),
    publisher: z.string().min(1, "Publisher is required"),
    isbn: z.string().regex(/^(?:\d-?){9}[\dX]$/, "Invalid ISBN format"),
    language: z.string().min(1, "Language is required"),
    series: z.string().optional(),
    genre: z
      .array(z.string().min(1, "Genre cannot be empty"))
      .nonempty("At least one genre required"),
    format: z.nativeEnum(BookFormat, {
      errorMap: () => ({ message: "Invalid format" }),
    }),
    pageCount: z.number().int().min(1, "Minimum 1 page required"),
    quantity: z.number().int().min(0, "Quantity cannot be negative"),
  }),
});

export const BookValidation = {
  createBookValidationSchema,
};
