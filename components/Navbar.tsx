import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { opensans, pacifico } from "@/lib/fonts";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-16 sticky z-30 inset-x-0 top-0 border-b border-gray-200 bg-white/70 backdrop-blur-xl transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center font-semibold text-2xl select-none xs:space-x-2 space-x-0.5"
          >
            <Image
              alt="logo"
              src="/images/logo.png"
              width={30}
              height={30}
              quality={100}
              priority
              className="w-auto h-auto"
            />

            <span className={`${pacifico.className} text-[#5a338a]`}>I</span>
            <span className={`${opensans.className} text-[#f658ee] text-2xl`}>
              T
            </span>
            <span className={`${pacifico.className} text-[#5a338a]`}>A.</span>
          </Link>

          {/* Add mobile navbar */}

          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-[15px] text-gray-900 font-semibold",
              })}
            >
              <h4>Pricing</h4>
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-[15px] text-gray-900 font-semibold",
              })}
            >
              <h4>Sign in</h4>
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-[15px] text-gray-900 font-semibold",
              })}
            >
              <h4>Sign out</h4>
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              Get started <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
