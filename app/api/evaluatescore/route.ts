import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_TOKEN = process.env.TOKEN;

const getAIInputs = async (interviewId: string) => {
  try {
    const interview = await prismadb.interview.findFirst({
      where: { id: interviewId },
    });

    const questionList = interview?.questions;
    const resume = interview?.resume;
    const job = interview?.jobTitle;
    const prompt = `This is my resume: ${resume} and the job description: ${job}. These are the list of questions asked in the interview: ${questionList}. Generate 10 common interview answers based on the questions provided. Each answer must be in a single line without any bulletins. Avoid using bulletins or numbering. Provide answers separated by \\n.`;

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

const similarityDetection = async (userAns: string, chatbotAns: string) => {
  try {
    const data = {
      inputs: {
        source_sentence: chatbotAns,
        sentences: [userAns],
      },
    };
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return response;
  } catch (error) {
    console.log("Similarity Detection Error: ", error);
    return 0;
  }
};

const personalityDetection = async (userInput: string) => {
  try {
    const data = { inputs: userInput };
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Minej/bert-base-personality",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response;
  } catch (error) {
    console.log("Personality Detection Error: ", error);
    return 0;
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interviewId, userInputs, emotionValues, totalDetectionTime } = body;

    console.log(
      "[EVALUATION_VALUES]",
      interviewId,
      userInputs,
      emotionValues,
      totalDetectionTime
    );

    // emotion scores
    const angry = (emotionValues.angry / totalDetectionTime) * 100 || 0;
    const sad = (emotionValues.sad / totalDetectionTime) * 100 || 0;
    const neutral = (emotionValues.neutral / totalDetectionTime) * 100 || 0;
    const happy = (emotionValues.happy / totalDetectionTime) * 100 || 0;
    const surprise = (emotionValues.surprise / totalDetectionTime) * 100 || 0;

    // personality scores
    let extroversion = 0;
    let neurotism = 0;
    let agreeableness = 0;
    let conscientiousness = 0;
    let openness = 0;

    // similarity scores
    let similarityScoreList: number[] = [];
    let similarityScore = 0;

    // const AIInputs = getAIInputs(interviewId);
    const AIInputs = [
      "I am a computer science student with a passion for coding.",
      "I am interested in this position because I believe I have the skills and experience to excel in this role.",
      "You should hire me because I am a hard worker and a quick learner.",
    ];

    for (let i = 0; i < userInputs.length; i++) {
      // similarityScore =
      //   similarityScore + similarityDetection(userInputs[i], AIInputs[i]);
      // similarityScoreList = [...similarityScoreList, similarityScore];
      // let personality_score = personalityDetection(userInputs[i])
      // extroversion += personality_score[0]
      // neurotism += personality_score[0]
      // agreeableness += personality_score[0]
      // conscientiousness += personality_score[0]
      // openness += personality_score[0]
    }

    similarityScore = (similarityScore / userInputs.length) * 100 + 2;
    extroversion = (extroversion / userInputs.length) * 100 + 2;
    neurotism = (neurotism / userInputs.length) * 100 + 2;
    agreeableness = (agreeableness / userInputs.length) * 100 + 2;
    conscientiousness = (conscientiousness / userInputs.length) * 100 + 2;
    openness = (openness / userInputs.length) * 100 + 2;

    const totalScore = Math.floor(Math.random() * 100) + 1;

    const interview = await prismadb.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        angry: angry + 1,
        sad: sad + 1,
        neutral: neutral + 1,
        happy: happy + 1,
        surprise: surprise + 1,
        extroversion: extroversion + 1,
        neurotism: neurotism + 1,
        agreeableness: agreeableness + 1,
        conscientiousness: conscientiousness + 1,
        openness: openness + 1,
        totalScore: totalScore + 1,
        userAnswers: userInputs,
      },
    });

    return NextResponse.json("success");
  } catch (error) {
    console.log("[EVALUATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
