// app/page.tsx
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Hedaer";
import HowItWorks from "@/components/home/HowItWorks";
import RideForm from "@/components/home/RideForm";
import Testimonials from "@/components/home/Testimonials";
import { UserType } from "@/types/auth";
import { DOMAIN_URL, isDev } from "@/utils/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import MapWrapper from "@/components/home/MapWrapper";

const getUser = async (): Promise<UserType | null> => {
  // get token
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return redirect("/login");

  // request into backend for get user_type
  const selfApi = "http://localhost:3000/api/v1/auth/user_type";
  const slefHttpsApi = `${DOMAIN_URL}/api/v1/auth/user_type`;
  const selfReqUrl = isDev ? selfApi : slefHttpsApi;

  const resData = await fetch(selfReqUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await resData.json() as UserType;
};


export default async function Home() {
  const user = await getUser();

  return (
    <Fragment>
      <Header user={user} />
      <MapWrapper/>
      <RideForm />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </Fragment>
  );
}
