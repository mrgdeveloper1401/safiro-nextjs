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

const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
};

const getUser = async (): Promise<UserType | null> => {
  const token = await getToken();
  if (!token) return redirect("/login");

  // request into backend for get user_type
  const selfApi = "http://localhost:3000/api/v1/auth/user_type";
  const slefHttpsApi = `${DOMAIN_URL}/api/v1/auth/user_type`;
  const selfReqUrl = isDev ? selfApi : slefHttpsApi;

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
          {/* نقشه */}
          {token && <MapWrapper token={token} />}

          {/* فرم ثبت سفر */}
          <RideForm />
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </Fragment>
  );
}
