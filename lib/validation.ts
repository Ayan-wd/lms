import { z } from "zod"

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  hourlyRate: z.number().min(0, "Hourly rate must be positive").optional(),
  bio: z.string().optional(),
})

export const demoRequestSchema = z.object({
  teacherId: z.string().uuid("Invalid teacher ID"),
  preferredDate: z.string().datetime("Invalid date"),
  preferredTime: z.string().min(1, "Time is required"),
  topic: z.string().min(1, "Topic is required"),
})

export const hireSchema = z.object({
  teacherId: z.string().uuid("Invalid teacher ID"),
})

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>
export type DemoRequest = z.infer<typeof demoRequestSchema>
export type Hire = z.infer<typeof hireSchema>
