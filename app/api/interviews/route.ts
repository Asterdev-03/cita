import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const interviews = await prismadb.interview.findMany({
      where: {
        userId: user?.id,
      },
    });

    const interviewsData = interviews.map((interview) => {
      return {
        id: interview.id,
        name: interview.jobTitle,
        createdAt: interview.date,
        score: interview.totalScore,
      };
    });

    console.log("[GET_INTERVIEWS]", interviewsData);
    return NextResponse.json(interviewsData);
  } catch (error) {
    console.log("[GET_INTERVIEWS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
