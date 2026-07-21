// app/page.tsx
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Hedaer";
import HowItWorks from "@/components/home/HowItWorks";
import RideForm from "@/components/home/RideForm";
import Testimonials from "@/components/home/Testimonials";
import { selfApi } from "@/lib/axios";
import { UserType } from "@/types/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const getUser = async (): Promise<UserType | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const resData = await selfApi.get("api/v1/auth/user_type/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resData.data as UserType;
  } catch {
    return redirect("/login")
  }
};

export default async function Home() {
  const user = await getUser();

  return (
    <Fragment>
      <Header user={user} />
      <RideForm />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </Fragment>
  );
}
