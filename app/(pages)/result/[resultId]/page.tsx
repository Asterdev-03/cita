import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { inter } from "@/lib/fonts";
import ResultPage from "./components/ResultPage";

interface PageProps {
  params: {
    resultId: string;
  };
  searchParams: {};
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: {
      // title.absolute ignores the title.template of RootLayout
      absolute: params.resultId,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { resultId } = params;
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
      <ResultPage resultId={resultId} />
    </section>
  );
}
