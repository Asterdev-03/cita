"use client";

import React, { useState } from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { StickyNote, BookOpenText } from "lucide-react";

const SetupPage: React.FC = () => {
  const [file1, setFile1] = useState<string>("");
  const [file2, setFile2] = useState<string>("");
  const [flag, setFlag] = useState<Boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;
    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string;
      if (flag) {
        setFile1(content);
        window.sessionStorage.setItem("resume", content);
        setFlag(!flag);
      } else {
        setFile2(content);
        window.sessionStorage.setItem("job", content);
      }
    };

    if (files && files.length > 0) {
      fileReader.readAsText(files[0]);
    }
  };

  return (
    <MaxWidthWrapper>
      <BreadcrumbNav />
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 xs:flex-row xs:items-center sm:gap-0">
        <h2 className="mb-3 font-semibold text-gray-900 leading-loose">
          Getting ready to <br />
          <span className="text-3xl font-bold">Setup Mock interview</span>
        </h2>
      </div>

      <div className="flex gap-24 mt-10 justify-center">
        <div
          className={`w-20 h-20 text-4xl text-white shadow-lg ${
            file1 ? "bg-green-700" : "bg-red-700"
          } rounded-full flex text-center items-center justify-center`}
        >
          <StickyNote size={24} />
        </div>
        <div
          className={`w-20 h-20 text-4xl text-white shadow-lg ${
            file2 ? "bg-green-700" : "bg-red-700"
          } rounded-full flex text-center items-center justify-center`}
        >
          <BookOpenText size={24} />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div
          x-ref="dnd"
          className="relative w-3/4 flex flex-col text-gray-400 border-dotted border-2 border-gray-500 p-4 m-4 rounded-2xl cursor-pointer"
        >
          <input
            accept=".txt"
            type="file"
            multiple
            className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
            onChange={handleChange}
          />

          <div className="flex flex-col items-center justify-center py-10 text-center">
            <svg
              className="w-24 text-current-50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-xl  my-4">
              {flag
                ? "Upload your resume to get started"
                : "Upload the job description to get started"}
            </h1>
            <p className="text-2xl font-bold mb-2 p-1 bg-none">
              {flag ? "Upload your resume" : "Upload your job description"}
            </p>
            <p>as .txt</p>
          </div>
        </div>
      </div>
      <div className="text-justify my-4">
        <h3 className="text-center text-4xl">Preview</h3>
        <div className="grid grid-cols-2 gap-2 m-4">
          <div className="border-solid border-2 rounded-2xl p-8 m-2">
            {file1}
          </div>
          <div className="border-solid border-2 rounded-2xl p-8 m-2">
            {file2}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href="/interview"
          className={buttonVariants({
            size: "lg",
            variant: "default",
            className: "mb-20 font-bold",
          })}
        >
          Get started
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default SetupPage;
