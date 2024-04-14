import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interviewId, userInputs } = body;

    const score = Math.floor(Math.random() * 100) + 1;

    const interview = await prismadb.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        score: score,
        userAnswers: userInputs,
      },
    });

    return NextResponse.json("success");
  } catch (error) {
    console.log("[EVALUATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
