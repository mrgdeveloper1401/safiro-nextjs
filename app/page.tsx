// app/page.tsx
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Hedaer";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import TripBooking from "@/components/home/TripBooking";
import { UserType } from "@/types/auth";
import { DOMAIN_URL, isDev } from "@/utils/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

const getUser = async (): Promise<UserType | null> => {
  const token = await getToken();
  if (!token) return redirect("/login");

  const selfApi = "http://localhost:3000/api/v1/auth/user_type";
  const selfHttpsApi = `${DOMAIN_URL}/api/v1/auth/user_type`;
  const selfReqUrl = isDev ? selfApi : selfHttpsApi;

  const resData = await fetch(selfReqUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await resData.json()) as UserType;
};

export default async function Home() {
  const user = await getUser();
  const token = await getToken();

  return (
    <Fragment>
      <Header user={user} />

      <section className="relative z-20 -mt-8 pb-8 sm:-mt-16">
        <div className="container mx-auto space-y-6 px-4">
          {token && <TripBooking token={token} />}
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </Fragment>
  );
}
