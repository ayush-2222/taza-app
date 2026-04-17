import { z } from "zod";

export const newsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(50).optional(),
  category: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  query: z.string().trim().optional()
});

export const newsIdSchema = z.object({
  id: z.string().trim().min(1)
});

export const videoIdSchema = z.object({
  id: z.string().trim().min(1)
});

export const likeSchema = z.object({
  userId: z.string().trim().min(1),
  newsId: z.string().trim().min(1)
});

export const locationSchema = z.object({
  userId: z.string().trim().optional(),
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().optional(),
  phoneNumber: z.string().trim().min(7).max(20).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  state: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120).optional(),
  isGuest: z.boolean().optional()
});

export const citizenNewsSchema = z.object({
  title: z.string().trim().min(5).max(180),
  content: z.string().trim().min(20),
  state: z.string().trim().min(2).max(80),
  language: z.string().trim().min(2).max(50)
});

export const authSignupSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    phoneNumber: z.string().trim().min(7).max(20),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    location: z.string().trim().min(2).max(120).optional(),
    city: z.string().trim().min(2).max(80).optional(),
    state: z.string().trim().min(2).max(80).optional()
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export const authLoginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(6).max(100)
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  state: z.string().trim().min(2).max(80).optional(),
  preferredCategory: z.string().trim().min(2).max(80).optional()
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(6).max(100),
    nextPassword: z.string().min(6).max(100)
  })
  .refine((value) => value.currentPassword !== value.nextPassword, {
    path: ["nextPassword"],
    message: "New password must be different"
  });

export const userIdSchema = z.object({
  id: z.string().trim().min(1)
});

export const adminNewsSchema = z.object({
  title: z.string().trim().min(5).max(180),
  description: z.string().trim().min(10).max(240),
  content: z.string().trim().min(20),
  category: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(80),
  imageUrl: z.string().trim().url().optional()
});

export const adminNewsUpdateSchema = adminNewsSchema.partial();

export const adminVideoSchema = z.object({
  title: z.string().trim().min(3).max(180),
  videoUrl: z.string().trim().url().optional(),
  thumbnail: z.string().trim().url().optional(),
  isLive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((value) => value === true || value === "true")
    .optional()
});

export const adminVideoUpdateSchema = adminVideoSchema.partial();
