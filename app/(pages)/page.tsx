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
              <span className="bg-gradient-to-r from-fuchsia-700 to-purple-600 bg-clip-text text-transparent">
                interview assistant
              </span>{" "}
              and do mock preps right away!!
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
                className: "mt-16 rounded-xl animate-bounce",
              })}
            >
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* HERO SECTION - 2*/}
      <div className="pattern1 px-4 py-8 xs:p-12 my-20 sm:my-26">
        <MaxWidthWrapper className="max-w-6xl p-4">
          <div className="flex flex-col space-y-14">
            <div className="grid grid-cols-3 gap-x-8">
              <div className="col-span-1 place-self-center">
                <Image
                  src="/images/create.png"
                  alt="product preview"
                  width={254}
                  height={254}
                  quality={100}
                  priority
                  sizes="100vw"
                  className="object-cover shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90 bg-slate-300 hover:scale-105 transition ease-in-out duration-500"
                />
              </div>
              <div className="col-span-2 place-self-center">
                <h2 className="lg:text-[65px] sm:text-[50px] xs:text-[35px] text-[25px] leading-normal sm:leading-[1.3] font-black bg-gradient-to-r from-emerald-500 to-purple-600 bg-clip-text text-transparent">
                  Prepare your tailored resume
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-8">
              <div className="col-span-1 place-self-center">
                <Image
                  src="/images/upload.png"
                  alt="product preview"
                  width={254}
                  height={254}
                  quality={100}
                  priority
                  sizes="100"
                  className="object-cover shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90 bg-slate-300 hover:scale-105 transition ease-in-out duration-500"
                />
              </div>
              <div className="col-span-2 place-self-center">
                <h2 className="lg:text-[65px] sm:text-[50px] xs:text-[35px] text-[25px] leading-normal sm:leading-[1.3] font-black bg-gradient-to-r from-sky-400 to-purple-600 bg-clip-text text-transparent">
                  Upload to CITA powered by Gemini
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-8">
              <div className="col-span-1 place-self-center">
                <Image
                  src="/images/interview.png"
                  alt="product preview"
                  width={254}
                  height={254}
                  quality={100}
                  priority
                  sizes="100"
                  className="object-cover shadow-2xl rounded-3xl ring-4 ring-offset-8 ring-zinc-200/90 bg-slate-300 hover:scale-105 transition ease-in-out duration-500"
                />
              </div>
              <div className="col-span-2 place-self-center">
                <h2 className="lg:text-[65px] sm:text-[50px] xs:text-[35px] text-[25px] leading-normal sm:leading-[1.3] font-black bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
                  Try mock interviews
                </h2>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
};

export default LandingPage;
