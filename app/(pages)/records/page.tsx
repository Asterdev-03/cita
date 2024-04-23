import { Metadata } from "next";
import { inter } from "@/lib/fonts";
import RecordsPage from "./components/RecordsPage";

export const metadata: Metadata = {
  title: "Records",
};

export default async function Page() {
  return (
    <section className={`${inter.className}`}>
      <RecordsPage />
    </section>
  );
}
