import { Metadata } from "next";
import { inter } from "@/lib/fonts";
import SetupPage from "./components/SetupPage";

export const metadata: Metadata = {
  title: "Setup",
};
export default async function Page() {
  return (
    <section className={`${inter.className}`}>
      <SetupPage />
    </section>
  );
}
