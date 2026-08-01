// lib/schema/trip.ts
import { z } from "zod";

export const reverseGeocodeSchema = z.object({
  lat: z.number().min(1, "عرض جغرافیایی الزامی هست"),
  lng: z.number().min(1, "طول جغرافیایی الزامی هست"),
});

export const ceateTripSchema = z.object({
  from_lat: z.number().min(1, "عرض مبدا الزامی است"),
  from_lng: z.number().min(1, "طول مبدا الزامی هست"),
  from_address: z.string().min(1, "ادرس مبدا الزامی هست"),
  to_lat: z.number().min(1, "عرض مقصد الزامی است"),
  to_lng: z.number().min(1, "طول مقصد الزامی هست"),
  to_address: z.string().min(1, "ادرس مقصد الزامی هست"),
  status: z.enum(["pending", "reserve"]).default("pending"),
  departure_time: z.iso.datetime(),
  reserve_for_other: z.boolean().default(false),
  phone_reserve_for_other: z.string().optional(),
  description: z.string(),
  trip_type: z.number(),
});

export const cancelTripSchema = z.object({
  status: z.string().default("cancelled"),
})

export type cancelTripInput = z.infer<typeof cancelTripSchema>;
export type ceateTripInput = z.infer<typeof ceateTripSchema>;
export type reverseGeocodeInput = z.infer<typeof reverseGeocodeSchema>;
