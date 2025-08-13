import { z } from "zod";
import { UserRole } from "./enums";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).optional().default(UserRole.JOB_SEEKER),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const jobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  company: z.string().min(3),
  location: z.string().min(3),
  salary: z.number().optional(),
  requirements: z.array(z.string()).optional(),
});

export const applicationSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
  paymentStatus: z.boolean().optional(),
  cvPath: z.string().optional(),
});
