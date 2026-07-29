// lib/schema/trip.ts
import { z } from "zod";

export const reverseGeocodeSchema = z.object({
  lat: z.number().min(1, "عرض جغرافیایی الزامی هست"),
  lng: z.number().min(1, "طول جغرافیایی الزامی هست"),
});

export type reverseGeocodeInput = z.infer<typeof reverseGeocodeSchema>;
