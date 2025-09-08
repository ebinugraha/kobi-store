import { z } from "zod";

export const signInSchemas = z.object({
  email: z.string().min(2, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password is required" }),
});

export const signUpSchemas = signInSchemas
  .extend({
    name: z.string().min(3, { message: "Name is required" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
