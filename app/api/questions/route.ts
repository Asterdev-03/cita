import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getQuestion = async (prompt: string) => {
  try {
    const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text, "\n\n");

    var sentences = text.split("\n");
    var sentencesArray = sentences.slice(0, 3);

    // Now, 'sentencesArray' contains each sentence as an element
    console.log(sentencesArray);

    return sentencesArray;
  } catch (error) {
    console.log("[AI_MODEL_POST]", error);
    return [""];
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resume, job } = body;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const prompt = `This is my resume: ${resume} and the job description: ${job}. Generate 10 common and simple interview questions based on my resume and the job description provided. Each question must be in a single line without any bulletins. Avoid using bulletins or numbering. DO NOT classify the questions as technical questions or HR questions. Provide questions separated by \\n.`;

    const sentencesArray = await getQuestion(prompt);

    const interview = await prismadb.interview.create({
      data: {
        userId: user?.id,
        questions: sentencesArray,
        resume: resume,
        jobTitle: job,
        totalScore: 0,
        similarityScore: 0,
        angry: 0,
        sad: 0,
        happy: 0,
        neutral: 0,
        surprised: 0,
        extroversion: 0,
        agreeableness: 0,
        conscientiousness: 0,
        neurotism: 0,
        openness: 0,
      },
    });

    const res = {
      questions: sentencesArray,
      interviewId: interview.id,
    };

    return NextResponse.json(res);
  } catch (error) {
    console.log("[INTERVIEW_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
