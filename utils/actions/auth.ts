import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleTokenVerificationError() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/");
}
