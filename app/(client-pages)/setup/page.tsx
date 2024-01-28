"use client";

import React, { useState } from "react";
import { UserOutlined, FileDoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "antd";

const Setup: React.FC = () => {
  const [file1, setFile1] = useState<String>("");
  const [file2, setFile2] = useState<String>("");
  const [flag, setFlag] = useState<Boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;
    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as String;
      if (flag) {
        setFile1(content);
        setFlag(!flag);
      } else {
        setFile2(content);
      }
    };

    if (files && files.length > 0) {
      fileReader.readAsText(files[0]);
    }
  };

  return (
    <div>
      <nav className="p-3 flex justify-between items-center bg-white/70 border-b-3 border-gray-200 shadow-md">
        <Image
          src="/images/fulllogo.png"
          alt="logo"
          height={60}
          width={110}
          sizes="100vw"
        />
        <Avatar size={40} icon={<UserOutlined />} />
      </nav>
      <div className="flex gap-24 mt-12 justify-center">
        <div
          className={`w-24 h-24 text-4xl text-white shadow-lg ${
            file1 ? "bg-green-700" : "bg-red-700"
          } rounded-full flex text-center items-center justify-center`}
        >
          <UserOutlined />
        </div>
        <div
          className={`w-24 h-24 text-4xl text-white shadow-lg ${
            file2 ? "bg-green-700" : "bg-red-700"
          } rounded-full flex text-center items-center justify-center`}
        >
          <FileDoneOutlined />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div
          x-ref="dnd"
          className="relative w-3/4 flex flex-col text-gray-400 border-dotted border-2 border-gray-500 p-4 m-4 rounded cursor-pointer"
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-xl  my-4">
              {flag
                ? "Upload your resume to get started"
                : "Upload the job description to get started"}
            </h1>
            <p className="text-2xl font-bold mb-2 p-1 bg-none border-2 border-gray-500 ">
              {flag ? "Upload your resume" : "Upload your job description"}
            </p>
            <p>as .txt</p>
          </div>
        </div>
      </div>
      <div className="text-justify my-8">
        <h3 className="text-center text-4xl">Preview</h3>
        <div className="grid grid-cols-2 gap-2 m-4">
          <div className="border-solid border-2 p-8 m-2">{file1}</div>
          <div className="border-solid border-2 p-8 m-2">{file2}</div>
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href="/mock-test"
          className="bg-green-700 mb-2 text-white px-4 py-2 rounded-md font-bold"
        >
          Get started
        </Link>
      </div>
    </div>
  );
};

export default Setup;
