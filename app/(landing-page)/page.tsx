import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const LandingPage: React.FC = () => {
  return (
    <section>
      {/* HERO SECTION */}

      <MaxWidthWrapper className="max-w-6xl px-4 mt-20 sm:mt-36 mb-12">
        <div></div>
      </MaxWidthWrapper>
    </section>
  );
};

export default LandingPage;
