import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const interviewId = await req.json();

    console.log("[GET_intevIEW_ID]", interviewId);

    const interview = await prismadb.interview.findFirst({
      where: { id: interviewId },
    });

    if (!interview) {
      return NextResponse.error();
    }

    const res = {
      date: interview.date,
      totalscore: interview.totalScore,
      weight: [
        interview.angry + 1,
        interview.happy + 1,
        interview.sad + 1,
        interview.surprised + 1,
        interview.neutral + 1,
      ],
      correction: interview.similarityScore,
      emotions: {
        extroversion: Math.round(interview.extroversion),
        neuroticism: Math.round(interview.neurotism),
        agreebleness: Math.round(interview.agreeableness),
        conscientiousness: Math.round(interview.conscientiousness),
        openness: Math.round(interview.openness),
      },
    };

    console.log("[GET_SCORE_POST]", res);
    return NextResponse.json(res);
  } catch (error) {
    console.log("[GET_SCORE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
