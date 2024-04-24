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
    const prompt = `This is my resume: ${resume} and the job description: ${job}. These are the list of questions asked in the interview: ${questionList}. Generate simple interview answers based on the questions provided. Each answer must be in a single line without any bulletins. Avoid using bulletins or numbering. Provide answers separated by \\n.`;

    const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Generated Text: ", text, "\n\n");

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

    const res = await response.json();
    console.log("Similarity Detection Response: ", res);

    return res[0];
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

    const res = await response.json();
    console.log("Personality Detection Response: ", res);

    return res;
  } catch (error) {
    console.log("Personality Detection Error: ", error);
    return [0, 0, 0, 0, 0];
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
    const angry =
      "angry" in emotionValues
        ? (emotionValues.angry / totalDetectionTime) * 100
        : 0;
    const sad =
      "sad" in emotionValues
        ? (emotionValues.sad / totalDetectionTime) * 100
        : 0;
    const neutral =
      "neutral" in emotionValues
        ? (emotionValues.neutral / totalDetectionTime) * 100
        : 0;
    const happy =
      "happy" in emotionValues
        ? (emotionValues.happy / totalDetectionTime) * 100
        : 0;
    const surprised =
      "surprised" in emotionValues
        ? (emotionValues.surprised / totalDetectionTime) * 100
        : 0;

    console.log("[EMOTION_SCORES]", angry, sad, neutral, happy, surprised);

    // personality scores
    let extroversion = 0;
    let neurotism = 0;
    let agreeableness = 0;
    let conscientiousness = 0;
    let openness = 0;

    // similarity scores
    let similarityScoreList: number[] = [];
    let totalsimilarityScore: number = 0;

    const AIInputs = await getAIInputs(interviewId);
    // const AIInputs = [
    //   "I am a computer science student with a passion for coding.",
    //   "I am interested in this position because I believe I have the skills and experience to excel in this role.",
    //   "You should hire me because I am a hard worker and a quick learner.",
    // ];

    for (let i = 0; i < userInputs.length; i++) {
      let similarityResult = await similarityDetection(
        userInputs[i],
        AIInputs[i]
      );

      if (typeof similarityResult === "number") {
        totalsimilarityScore += similarityResult;
        similarityScoreList = [...similarityScoreList, similarityResult];
      } else {
        similarityScoreList = [...similarityScoreList, 0];
      }

      let personality_score = await personalityDetection(userInputs[i]);

      if (Array.isArray(personality_score)) {
        const [labels] = personality_score;
        const [lab1, lab2, lab3, lab4, lab5]: any = labels;
        extroversion += lab1.score;
        neurotism += lab2.score;
        agreeableness += lab3.score;
        conscientiousness += lab4.score;
        openness += lab5.score;
      }
    }

    totalsimilarityScore = (totalsimilarityScore / userInputs.length) * 100;
    extroversion = (extroversion / userInputs.length) * 100;
    neurotism = (neurotism / userInputs.length) * 100;
    agreeableness = (agreeableness / userInputs.length) * 100;
    conscientiousness = (conscientiousness / userInputs.length) * 100;
    openness = (openness / userInputs.length) * 100;

    const totalScore = Math.floor(Math.random() * 100);

    const interview = await prismadb.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        angry: angry,
        sad: sad,
        neutral: neutral,
        happy: happy,
        surprised: surprised,
        extroversion: extroversion,
        neurotism: neurotism,
        agreeableness: agreeableness,
        conscientiousness: conscientiousness,
        openness: openness,
        totalScore: totalScore,
        userAnswers: userInputs,
        similarityScoreList: similarityScoreList,
        similarityScore: totalsimilarityScore,
      },
    });

    console.log("[INTERVIEW_UPDATE]", interview);

    return NextResponse.json("success");
  } catch (error) {
    console.log("[EVALUATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
