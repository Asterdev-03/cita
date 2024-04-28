import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { inter } from "@/lib/fonts";
import DashboardPage from "./components/DashboardPage";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  // get the session of logged in user
  const { getUser } = getKindeServerSession();

  // Check if the user is already logged in the browser
  const user = await getUser();
  if (!user || !user.id) {
    redirect("/auth-callback?origin=dashboard");
  }

  // If logged in browser, also check the database for the user
  const dbUser = await prismadb.user.findUnique({
    where: {
      kindeId: user?.id,
    },
  });
  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }

  return (
    <section className={`${inter.className}`}>
      <DashboardPage />
    </section>
  );
}
