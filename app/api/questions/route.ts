import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getQuestion = async () => {
  try {
    const resume = `An aspiring Computer Science student.\nWORK HISTORY:\n1. Web Developer for Blueway Trading Company\n2. Front-end Developer (Volunteer) for GTech MuLearn\nSKILLS: C, C++, Java, Python , Database: MySQL, MongoDB , Time Management, Project Planning, HTML5, CSS, JavaScript , Problem Solving , Team Management, MERN Stack, Next.js, Detail-Oriented, Self-Management\nPERSONAL PROJECTS: Conversational Interview and Training Assistant (Ongoing),Quiz Web App,Portfolio Website,Discord Bot`;
    const job = `React Developer`;
    const prompt = `This is my resume: ${resume} and the job description: ${job}. Generate 10 common interview questions based on my resume and the job description provided. Each question must be in a single line without any bulletins. Avoid using bulletins or numbering. DO NOT classify the questions as technical questions or HR questions, All questions should be in a shuffled manner. Provide questions separated by \\n.`;

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
    return error;
  }
};

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  try {
    const body = await req.json();
    // const { resume, job } = body;

    const text = [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "Why should we hire you?",
    ];
    const resume = `An aspiring Computer Science student.\nWORK HISTORY:\n1. Web Developer for Blueway Trading Company\n2. Front-end Developer (Volunteer) for GTech MuLearn\nSKILLS: C, C++, Java, Python , Database: MySQL, MongoDB , Time Management, Project Planning, HTML5, CSS, JavaScript , Problem Solving , Team Management, MERN Stack, Next.js, Detail-Oriented, Self-Management\nPERSONAL PROJECTS: Conversational Interview and Training Assistant (Ongoing),Quiz Web App,Portfolio Website,Discord Bot`;
    const job = `React Developer`;

    const key = process.env.API_KEY;

    if (key === undefined) {
      const interview = await prismadb.interview.create({
        data: {
          userId: "jhfghdkfjnkjk",
          questions: text,
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
        questions: text,
        interviewId: interview.id,
      };

      return NextResponse.json(res);
    } else {
      const prompt = `This is my resume: ${resume} and the job description: ${job}. Generate 10 common and simple interview questions based on my resume and the job description provided. Each question must be in a single line without any bulletins. Avoid using bulletins or numbering. DO NOT classify the questions as technical questions or HR questions. Provide questions separated by \\n.`;

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
    }
  } catch (error) {
    console.log("[INTERVIEW_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
