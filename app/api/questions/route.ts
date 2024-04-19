import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // const { resume, job } = body;

    const text = [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "Why should we hire you?",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in five years?",
      "Why did you leave your last job?",
      "What are your salary expectations?",
      "What are your proudest professional accomplishments?",
      "What is your favorite way to learn new things?",
      "What are your current job responsibilities?",
    ];
    const resume = `An aspiring Computer Science student.\nWORK HISTORY:\n1. Web Developer for Blueway Trading Company\n2. Front-end Developer (Volunteer) for GTech MuLearn\nSKILLS: C, C++, Java, Python , Database: MySQL, MongoDB , Time Management, Project Planning, HTML5, CSS, JavaScript , Problem Solving , Team Management, MERN Stack, Next.js, Detail-Oriented, Self-Management\nPERSONAL PROJECTS: Conversational Interview and Training Assistant (Ongoing),Quiz Web App,Portfolio Website,Discord Bot`;
    const job = `React Developer`;

    const key = process.env.API_KEY;

    if (key === undefined) {
      const interview = await prismadb.interview.create({
        data: {
          userId: "cluvdmhxs000013vrttdznwdf",
          questions: text,
          resume: resume,
          jobTitle: job,
          score: 0,
        },
      });
      const res = {
        questions: text,
        interviewId: interview.id,
      };

      return NextResponse.json(res);
    } else {
      const prompt = `This is my resume: ${resume} and the job description: ${job}. Generate 10 common interview questions based on my resume and the job description provided. Each question must be in a single line without any bulletins. Avoid using bulletins or numbering. DO NOT classify the questions as technical questions or HR questions, All questions should be in a shuffled manner. Provide questions separated by \\n.`;

      const genAI = new GoogleGenerativeAI(`${key}`);

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

      const interview = await prismadb.interview.create({
        data: {
          userId: "cluvdmhxs000013vrttdznwdf",
          questions: sentencesArray,
          resume: resume,
          jobTitle: job,
          score: 0,
        },
      });

      const res = {
        questions: sentencesArray,
        interviewId: interview.id,
      };

      return NextResponse.json(res);
    }
  } catch (error) {
    console.log("[INTERVIEW_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
