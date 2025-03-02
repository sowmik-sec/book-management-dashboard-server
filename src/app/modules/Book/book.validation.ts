import { z } from "zod";
import { BookFormat } from "./book.constant";

const createBookValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Book name is required"),
    author: z.string().min(1, "Author name is required"),
    price: z.number().min(0, "Price must be ≥ 0"),
    releaseDate: z.date().or(z.string().pipe(z.coerce.date())),
    publisher: z.string().min(1, "Publisher is required"),
    isbn: z.string(),
    language: z.string().min(1, "Language is required"),
    series: z.string().optional(),
    genres: z
      .array(
        z.object({
          genre: z.string().min(0, "Genre can be empty"),
          isDeleted: z.boolean().default(false),
        })
      )
      .nonempty("At least one genre is required"),
    format: z.nativeEnum(BookFormat, {
      errorMap: () => ({ message: "Invalid format" }),
    }),
    pageCount: z.number().int().min(1, "Minimum 1 page required"),
    quantity: z.number().int().min(1, "Quantity cannot be negative"),
  }),
});

const updateBookValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Book name is required").optional(),
    author: z.string().min(1, "Author name is required").optional(),
    price: z.number().min(0, "Price must be ≥ 0").optional(),
    releaseDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
    publisher: z.string().min(1, "Publisher is required").optional(),
    isbn: z.string().optional(),
    language: z.string().min(1, "Language is required").optional(),
    series: z.string().optional(),
    genres: z
      .array(
        z.object({
          genre: z.string().min(1, "Genre cannot be empty"),
          isDeleted: z.boolean().default(false),
        })
      )
      .optional(),
    format: z
      .nativeEnum(BookFormat, {
        errorMap: () => ({ message: "Invalid format" }),
      })
      .optional(),
    pageCount: z.number().int().min(1, "Minimum 1 page required").optional(),
    quantity: z.number().int().min(1, "Quantity cannot be negative").optional(),
  }),
});

const deleteMultipleBooksValidationSchema = z.object({
  body: z.object({
    bookIds: z
      .array(z.string().min(1, "IDs cannot be empty"))
      .nonempty("At least one Book ID is required"),
  }),
});

export const BookValidation = {
  createBookValidationSchema,
  updateBookValidationSchema,
  deleteMultipleBooksValidationSchema,
};
