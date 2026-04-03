import { z } from "zod";
import { COMPANY_STATUSES } from "../constants.js";

export const createCompanySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  missionStatement: z.string().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.enum(COMPANY_STATUSES).optional(),
  description: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  missionStatement: z.string().nullable().optional(),
});

