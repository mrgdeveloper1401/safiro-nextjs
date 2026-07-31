// utils/neshan.ts
export type ReverseResult = {
  formatted_address: string;
  neighbourhood?: string;
  city?: string;
  state?: string;
  route_name?: string;
  in_traffic_zone?: boolean;
};

export async function reverseGeocode(
  lat: number,
  lng: number,
  token?: string
): Promise<ReverseResult | null> {
  try {
    const res = await fetch("/api/v1/neshan/reverse", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: lat, lng: lng }),
    });
    if (!res.ok) return null;
    const data = await res.json();

    return {
      formatted_address: data.formatted_address || "آدرس نامشخص",
      neighbourhood: data.neighbourhood,
      city: data.city,
      state: data.state,
      route_name: data.route_name,
      in_traffic_zone: data.in_traffic_zone,
    };
  } catch (error) {
    return null;
  }
}
