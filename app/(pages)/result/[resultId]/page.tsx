import { Metadata } from "next";
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
  console.log(resultId);

  return (
    <section className={`${inter.className}`}>
      <ResultPage resultId={resultId} />
    </section>
  );
}
