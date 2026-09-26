import { z } from "zod";

export const requestAccessSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .trim()
    .toLowerCase(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(1, "Password is required"),
});

export type RequestAccessInput = z.infer<typeof requestAccessSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const accessRequestFilterSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional().default("PENDING"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const userFilterSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "REVOKED"]).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const createGameSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .trim()
    .optional(),
  thumbnailUrl: z
    .string()
    .max(500, "Thumbnail URL must be 500 characters or less")
    .trim()
    .optional(),
  gameUrl: z
    .string()
    .min(1, "Game URL is required")
    .max(500, "Game URL must be 500 characters or less")
    .trim(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

export const updateGameSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .trim()
    .optional(),
  thumbnailUrl: z
    .string()
    .max(500, "Thumbnail URL must be 500 characters or less")
    .trim()
    .optional(),
  gameUrl: z
    .string()
    .min(1, "Game URL cannot be empty")
    .max(500, "Game URL must be 500 characters or less")
    .trim()
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type AccessRequestFilterInput = z.infer<typeof accessRequestFilterSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
