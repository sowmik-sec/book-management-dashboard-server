import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password required"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
