import { Types } from "mongoose";
import { z } from "zod";

const createSaleZodSchema = z.object({
  body: z.object({
    book: z
      .string({ required_error: "Book ID is required" })
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid Book ID format",
      }),
    quantity: z
      .number({ required_error: "Quantity is required" })
      .int({ message: "Quantity must be an integer" })
      .min(1, { message: "Quantity must be at least 1" })
      .default(1), // Default value if not provided
    buyer: z.string({ required_error: "Buyer name is required" }).min(1, {
      message: "Buyer name cannot be empty",
    }),
    saleDate: z
      .string()
      .datetime({ message: "Invalid date format" })
      .default(() => new Date().toISOString()) // Default to current ISO date
      .or(z.date()) // Allow Date objects as well
      .transform((val) => new Date(val)), // Transform to Date object
    seller: z
      .string({ required_error: "Seller ID is required" })
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid Seller ID format",
      }),
  }),
});

export const SaleValidation = {
  createSaleZodSchema,
};
