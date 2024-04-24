"use client";

import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { inter } from "@/lib/fonts";

import { format } from "date-fns";

import { useCallback, useEffect, useState } from "react";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import SkillCards from "./SkillCards";
import { Rss } from "lucide-react";

interface Emotions {
  extroversion: number;
  neuroticism: number;
  agreebleness: number;
  conscientiousness: number;
  openness: number;
}

interface Score {
  date: Date;
  totalscore: number;
  weight: number[];
  correction: number;
  emotions: Emotions;
}

interface ResultPageProps {
  resultId: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ resultId }) => {
  const [scores, setScores] = useState<Score>({
    date: new Date("2023-12-21T13:51:06.661+00:00"),
    totalscore: 0,
    weight: [0],
    correction: 0,
    emotions: {
      extroversion: 0,
      neuroticism: 0,
      agreebleness: 0,
      conscientiousness: 0,
      openness: 0,
    },
  });

  const fetchScores = useCallback(async () => {
    try {
      const response = await fetch("/api/getscore", {
        method: "POST",
        body: JSON.stringify(resultId),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const res = await response.json();
      console.log(res);
      setScores(res);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, []);

  const OverallScore = () => {
    return (
      <div className="my-2 p-3 border-2 shadow-lg rounded-lg text-center bg-zinc-50">
        <h2 className="my-6 font-semibold text-gray-900 text-lg">
          {format(scores.date, "do MMMM, yyyy EEEE")}
        </h2>
        <div className="grid place-content-center">
          <DoughnutChart score={scores.totalscore} />
        </div>
      </div>
    );
  };

  return (
    <section className={`${inter.className}`}>
      <MaxWidthWrapper>
        <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 content-end">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 xs:flex-row xs:items-center sm:gap-0">
              <h2 className="mb-3 font-semibold text-gray-900 leading-loose">
                Lets analyze your <br />
                <span className="text-3xl font-bold">Results</span>
              </h2>
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "default",
                  variant: "secondary",
                })}
              >
                Back to Dashboard
              </Link>
            </div>
            <OverallScore />
          </div>

          <div className="lg:col-span-2 content-end">
            <div className="my-2 p-3 border-2 shadow-lg rounded-lg bg-zinc-50">
              <h2 className="my-6 font-semibold text-gray-900 text-lg">
                Your state of mind
              </h2>
              <div className="relative h-full w-full">
                <BarChart weight={scores.weight} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 my-2 p-3 border-2 shadow-lg rounded-lg bg-zinc-50">
            <h2 className="my-6 font-semibold text-gray-900 text-lg">
              Communication skills
            </h2>
            <SkillCards
              correction={scores.correction}
              extroversion={scores.emotions.extroversion}
              neuroticism={scores.emotions.neuroticism}
              agreebleness={scores.emotions.agreebleness}
              conscientiousness={scores.emotions.conscientiousness}
              openness={scores.emotions.openness}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ResultPage;
