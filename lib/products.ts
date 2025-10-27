export interface TutoringPackage {
  id: string
  name: string
  description: string
  hours: number
  priceInCents: number
}

export const TUTORING_PACKAGES: TutoringPackage[] = [
  {
    id: "starter-5h",
    name: "Starter Package",
    description: "5 hours of tutoring sessions",
    hours: 5,
    priceInCents: 0, // Price calculated based on teacher's hourly rate
  },
  {
    id: "standard-10h",
    name: "Standard Package",
    description: "10 hours of tutoring sessions",
    hours: 10,
    priceInCents: 0, // Price calculated based on teacher's hourly rate
  },
  {
    id: "premium-20h",
    name: "Premium Package",
    description: "20 hours of tutoring sessions",
    hours: 20,
    priceInCents: 0, // Price calculated based on teacher's hourly rate
  },
]
