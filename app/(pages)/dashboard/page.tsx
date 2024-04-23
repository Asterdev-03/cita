import { Metadata } from "next";
import { inter } from "@/lib/fonts";
import DashboardPage from "./components/DashboardPage";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <section className={`${inter.className}`}>
      <DashboardPage />
    </section>
  );
}
