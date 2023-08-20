import z from "zod";

const userVisitedEventSchema = z.object({
  visitedOn: z.date(),
  countryCode: z.string().min(2).max(2),
  continent: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  postalCode: z.string().min(5).max(12),
  city: z.string(),
  state: z.string(),
  timezone: z.string(),
  ip: z.string().ip(),
  url: z.string().url(),
});

export type UserVisitedEventSchema = z.infer<typeof userVisitedEventSchema>;

export { userVisitedEventSchema };
