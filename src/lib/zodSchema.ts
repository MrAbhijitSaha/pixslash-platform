import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(5, { error: "Name must be at least 5 characters long" })
      .max(32, { error: "Name must not exceed 32 characters" }),
    emailAddress: z
      .email({ error: "Please enter a valid  email address." })
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, { error: "Passsword must be at least 8 characters long" })
      .max(128, { error: "Passsword must not exceed 128 characters" }),

    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password didn't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  emailAddress: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Passsword must be at least 8 characters long" })
    .max(128, { error: "password must not exceed 128 characters" }),
  rememberMe: z.boolean(),
});

export const commentSchema = z.object({
  commentText: z
    .string()
    .trim()
    .min(4, { error: "Comment is too short." })
    .max(300, { error: "Comment is too long." }),
});

export const wallpaperUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { error: "Title must be at least 5 characters" }),

  description: z
    .string()
    .trim()
    .min(10, { error: "Description must be at least 10 characters" })
    .max(100, { error: "Description must not exceed 100 characters" }),

  tags: z
    .array(z.string().trim().min(1))
    .max(10, { error: "Maximum 10 tags are allowed" })
    .default([]),

  category: z
    .string()
    .min(1, { error: "Please choose your wallpaper category" }),
});

export const profileInformationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { error: "Name must be at least 5 characters long" })
    .max(32, { error: "Name must not exceed 32 characters" }),

  mobileNumber: z
    .string()
    .length(10, { error: "Invaild number" })
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .min(10, { error: "Bio must be at least 10 characters long" })
    .max(100, { error: "Bio must not exceed 100 characters" })
    .optional()
    .or(z.literal("")),
});

export const chnagePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .max(128, { error: "Passsword must not exceed 128 characters" }),

    newPassword: z
      .string()
      .min(8, { error: "Passsword must be at least 8 characters long" })
      .max(128, { error: "Passsword must not exceed 128 characters" }),

    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Password didn't match",
    path: ["confirmPassword"],
  });
