import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const LandingPage: React.FC = () => {
  return (
    <section>
      {/* HERO SECTION - 1*/}

      <div className="relative isolate">
        {/* background design */}
        <div
          area-hidden="true"
          className="absolute inset-x-0 -top-40 sm:-top-80 -z-10 pointer-events-none transform-gpu overflow-hidden blur-2xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative w-[36.125rem] sm:w-[72.187rem] left-[calc(50%-11rem)] sm:left-[calc(50%-10rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#736eb9] to-[#923d99] opacity-30"
          />
        </div>

        {/* title */}
        <MaxWidthWrapper className="max-w-6xl px-4 mt-20 sm:mt-36 mb-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold leading-[60px] md:leading-[65px] lg:leading-[90px]">
              Meet your new {""}
              <span className="text-pink-500">interview assistant</span> and do
              mock preps right away!!
            </h2>
            <p className="max-w-prose mt-5 text-zinc-700 sm:textlg">
              Conversational Interview and Training Assistant allows you to
              practice mock interview sessions with AI. Simply upload your
              resume and job description. Let the AI do the rest.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                variant: "default",
                className: "mt-5 rounded-xl",
              })}
            >
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* HERO SECTION - 2*/}

      <MaxWidthWrapper className="max-w-6xl px-4 mt-20 sm:mt-32 mb-12">
        <div className="pattern1 p-6 w-full flex flex-col items-center space-y-20">
          <div className="w-full flex items-center justify-center gap-20">
            <Image
              src="/images/create.png"
              alt="product preview"
              width={254}
              height={265}
              sizes="100vw"
              quality={100}
              priority
              className="shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90"
            />
            <h2 className="text-[70px] text-gray-900 font-black">
              Prepare your resume
            </h2>
          </div>

          <div className="w-full flex items-center justify-center gap-20">
            <Image
              src="/images/upload.png"
              alt="product preview"
              width={254}
              height={265}
              sizes="100vw"
              quality={100}
              priority
              className="shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90"
            />
            <h2 className="text-[70px] text-gray-900 font-black">
              Just give you job description and resume to CITA
            </h2>
          </div>

          <div className="w-full flex items-center justify-center gap-20">
            <Image
              src="/images/interview.png"
              alt="product preview"
              width={254}
              height={265}
              sizes="100vw"
              quality={100}
              priority
              className="shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90"
            />
            <h2 className="text-[70px] text-gray-900 font-black">
              Shine your Interview
            </h2>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default LandingPage;
