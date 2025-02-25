import { z } from "zod";
const createUserZodSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    name: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
    }),
    contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
