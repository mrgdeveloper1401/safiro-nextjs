import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { slefHttpsApi } from "@/lib/axios";
import PassengerProfileClient from "@/components/auth/passenger/PassengerProfileClient";

export interface PassengerProfile {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string | null;
    is_driver?: boolean;
    is_passenger?: boolean;
    image?: string | null;
  };
  rating: string | null;
  total_rides: number;
  wallet_balance: string;
  profile_image: string | null;
  created_at: string;
}

async function getPassengerProfile(
  token: string
): Promise<PassengerProfile | null> {
  try {
    const res = await slefHttpsApi.get("api/v1/auth/passenger/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) return null;
    return res.data;
  } catch {
    return null;
  }
}

export default async function PassengerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const passenger = await getPassengerProfile(token);

  if (!passenger) redirect("/login");

  return <PassengerProfileClient passenger={passenger} />;
}
