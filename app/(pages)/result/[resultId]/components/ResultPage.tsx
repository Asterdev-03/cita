"use client";

import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import SkillCards from "./SkillCards";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";

const ResultPage: React.FC = () => {
  const OverallScore = () => {
    return (
      <div className="my-2 p-3 border-2 shadow-lg rounded-lg text-center bg-zinc-50">
        <h2 className="my-6 font-semibold text-gray-900 text-lg">
          {format(
            new Date("2023-12-21T13:51:06.661+00:00"),
            "do MMMM, yyyy EEEE"
          )}
        </h2>
        <div className="grid place-content-center">
          <DoughnutChart />
        </div>
      </div>
    );
  };

  return (
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
              <BarChart />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 my-2 p-3 border-2 shadow-lg rounded-lg bg-zinc-50">
          <h2 className="my-6 font-semibold text-gray-900 text-lg">
            Communication skills
          </h2>
          <SkillCards />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ResultPage;
