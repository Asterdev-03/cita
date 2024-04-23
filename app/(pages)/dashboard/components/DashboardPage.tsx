"use client";

import React, { useState } from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Ghost, Loader2, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import LineChart from "./LineChart";

const DashboardPage: React.FC = () => {
  const [currentDeletingFile, setCurrentDeletingFile] = useState<string | null>(
    null
  );

  // TODO: Delete api request for files

  // Dummy data
  const files = [
    {
      id: "123abc",
      name: "Interview for Google",
      key: "123abc",
      createdAt: "2023-12-21T13:51:06.661+00:00",
      updatedAt: "2023-12-28T13:51:06.661+00:00",
    },
    {
      id: "1234abcd",
      name: "Meta interview",
      key: "1234abcd",
      createdAt: "2023-12-22T13:51:06.661+00:00",
      updatedAt: "2023-12-28T13:51:06.661+00:00",
    },
    {
      id: "12345adcde",
      name: "TCS SDE interview",
      key: "12345adcde",
      createdAt: "2023-12-19T13:51:06.661+00:00",
      updatedAt: "2023-12-28T13:51:06.661+00:00",
    },
    {
      id: "123456adcdef",
      name: "CITA internship mock",
      key: "123456adcdef",
      createdAt: "2023-12-29T13:51:06.661+00:00",
      updatedAt: "2023-12-28T13:51:06.661+00:00",
    },
    {
      id: "1234567abcdefg",
      name: "Sample interview",
      key: "1234567abcdefg",
      createdAt: "2023-12-30T13:51:06.661+00:00",
      updatedAt: "2023-12-28T13:51:06.661+00:00",
    },
  ];

  const displayFiles = () => {
    return (
      <ul className="my-2 p-3 grid gap-6 grid-cols-2 lg:grid-cols-3 border-2 shadow-lg rounded-lg">
        {files!
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3)
          .map((file) => (
            <li
              key={file.id}
              className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg border border-1 border-gray-100"
            >
              <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-zinc-200 to-neutral-200" />
                <div className="flex-1 text-ellipsis overflow-hidden">
                  {/* "text-ellipsis overflow-hidden" is same as "truncate" */}
                  <h3 className="text-lg font-medium text-zinc-900 truncate">
                    {file.name}
                  </h3>
                </div>
              </div>

              <div className="px-6 mt-4 grid grid-cols-2 place-items-center py-2 gap-6 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(file.createdAt), "MMM yyyy")}
                </div>

                <Button
                  onClick={() => null}
                  size="sm"
                  className="w-full"
                  variant="destructive"
                >
                  {currentDeletingFile === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}

        <Link
          className={`${buttonVariants({
            size: "sm",
            variant: "ghost",
          })} place-self-center lg:place-self-start`}
          href="/records"
        >
          See all...
        </Link>
      </ul>
    );
  };

  const displayEmpty = () => {
    return (
      <div className="mt-16 flex flex-col items-center gap-2 text-zinc-400 select-none">
        <Ghost className="h-8 w-8 text-zinc-400" />
        <h3 className="font-semibold text-xl">Pretty empty around here</h3>
        <p>Lets&apos;s try out a mock session.</p>
        <br />
        <p>
          Click on the{" "}
          <span className="font-bold text-gray-600">Start Practicing</span>{" "}
          button in the Dashboard.
        </p>
      </div>
    );
  };

  const displayLoading = () => (
    <Skeleton height={60} className="my-2" count={6} enableAnimation />
  );

  return (
    <MaxWidthWrapper>
      <BreadcrumbNav />
      <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 xs:flex-row xs:items-center sm:gap-0">
            <h2 className="mb-3 font-semibold text-gray-900 leading-loose">
              Good morning, welcome to <br />
              <span className="text-3xl font-bold">My Dashboard</span>
            </h2>
            <Link
              href="/setup"
              className={buttonVariants({
                size: "lg",
                variant: "default",
              })}
              style={{ borderRadius: "40px" }}
            >
              Start practicing
            </Link>
          </div>

          {/* Charts */}
          <h2 className="my-6 font-semibold text-gray-900 text-lg">Overview</h2>
          <LineChart />
        </div>

        {/* This calender renders in large and small screen */}
        <div className="hidden lg:block max-sm:block place-self-center lg:place-self-end max-sm:mt-10">
          <Calendar
            mode="single"
            className="rounded-md border"
            numberOfMonths={1}
            styles={{
              caption: { color: "purple" },
            }}
          />
        </div>

        {/* This calender renders in medium screen */}
        <div className="hidden lg:hidden sm:block place-self-center lg:place-self-end mt-10">
          <Calendar
            mode="single"
            className="rounded-md border"
            numberOfMonths={2}
            styles={{
              caption: { color: "purple" },
            }}
          />
        </div>

        {/* History */}
        <div className="lg:col-span-3">
          <h2 className="my-6 font-semibold text-gray-900 text-lg">History</h2>
          {files && files?.length !== 0
            ? displayFiles()
            : // : isLoading
              // ? displayLoading()
              displayEmpty()}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
