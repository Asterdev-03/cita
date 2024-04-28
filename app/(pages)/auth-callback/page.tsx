"use client";

// auth-callback always triggers in two cases
// Case 1: If user is not logged in the browser
// Case 2: If user is logged in browser but not existing in database (usually after signup)

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { actionSigninSignup } from "@/lib/actions";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // get the search params from query string named origin
    const origin = searchParams.get("origin");

    const checkAuth = async () => {
      const response = await actionSigninSignup();
      if (response) {
        router.push(origin ? origin : "/dashboard");
      }
    };

    checkAuth();
  }, []);

  // Get request
  const checkAuth = async () => {
    const response = await actionSigninSignup();
    if (response) {
      router.push(origin ? origin : "/dashboard");
    }
  };

  return (
    <section>
      <div className="w-full mt-24 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl ">Setting up your account...</h3>
        <p>Please wait to be redirected automatically</p>
      </div>
    </section>
  );
}
