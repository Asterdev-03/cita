import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white">
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 flex flex-col items-center justify-center h-screen">
          <h1 className="text-white text-6xl font-bold">CITA</h1>
          <p className="text-white text-lg mb-2">
            The most powerful conversational AI ever created.
          </p>
          <Link
            href="/setup"
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className: "mt-5 rounded-xl text-purple-900",
            })}
          >
            Get started
          </Link>
        </div>
        <div className="container mx-auto py-16">
          <h2 className="text-3xl font-bold text-center">Features</h2>
          <div className="flex flex-wrap justify-center mt-8">
            <div className="w-1/3 p-4">
              <h3 className="text-2xl font-bold">Generate text</h3>
              <p>
                Create text, translate languages, write different kinds of
                creative content, and answer your questions in an informative
                way.
              </p>
            </div>
            <div className="w-1/3 p-4">
              <h3 className="text-2xl font-bold">Answer questions</h3>
              <p>
                Answer your questions in an informative way, even if they are
                open ended, challenging, or strange.
              </p>
            </div>
            <div className="w-1/3 p-4">
              <h3 className="text-2xl font-bold">Complete requests</h3>
              <p>
                Complete your requests thoughtfully, even if they are open
                ended, challenging, or strange.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-400 flex flex-col items-center justify-center h-screen">
          <h2 className="text-white text-6xl font-bold">Try CITA today</h2>
          <p className="text-white text-lg">It's free to get started.</p>
          <Link
            href="/signup"
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className: "mt-5 rounded-xl text-purple-900",
            })}
          >
            Sign up
          </Link>
        </div>
        <div className="bg-gray-800 text-white py-4">
          <div className="container mx-auto">
            <p className="text-center">Copyright © 2023 CITA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
