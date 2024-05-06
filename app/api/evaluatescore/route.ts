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

const similarityDetectionWithRetry = async (
  userAns: string,
  chatbotAns: string
): Promise<number | undefined> => {
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
    // Retry after 20 seconds
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20 seconds delay
    // Retry the function
    return similarityDetectionWithRetry(userAns, chatbotAns);
  }
};

const personalityDetectionWithRetry = async (
  userInput: string
): Promise<any> => {
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
    // Retry after 20 seconds
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20 seconds delay
    // Retry the function
    return personalityDetectionWithRetry(userInput);
  }
};

async function loadModels() {
  console.log("Function execution after 20 seconds.");
  // Call the provided function
  await personalityDetectionWithRetry("Hello World");
  await similarityDetectionWithRetry("Hello World", "Hello World");

  // Wait for 10 seconds using setTimeout
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Close the function after waiting
  console.log("Function execution complete after 20 seconds.");
}

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
      "angry" in emotionValues && !isNaN(emotionValues.angry)
        ? (emotionValues.angry / totalDetectionTime) * 2
        : 0;
    const sad =
      "sad" in emotionValues && !isNaN(emotionValues.sad)
        ? (emotionValues.sad / totalDetectionTime) * 2
        : 0;
    const neutral =
      "neutral" in emotionValues && !isNaN(emotionValues.neutral)
        ? (emotionValues.neutral / totalDetectionTime) * 2
        : 0;
    const happy =
      "happy" in emotionValues && !isNaN(emotionValues.happy)
        ? (emotionValues.happy / totalDetectionTime) * 2
        : 0;
    const surprised =
      "surprised" in emotionValues && !isNaN(emotionValues.surprised)
        ? (emotionValues.surprised / totalDetectionTime) * 2
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

    // await loadModels();

    for (let i = 0; i < userInputs.length; i++) {
      let similarityResult = await similarityDetectionWithRetry(
        userInputs[i],
        AIInputs[i]
      );

      if (typeof similarityResult === "number") {
        totalsimilarityScore += similarityResult;
        similarityScoreList = [...similarityScoreList, similarityResult];
      } else {
        similarityScoreList = [...similarityScoreList, 0];
      }

      let personality_score = await personalityDetectionWithRetry(
        userInputs[i]
      );

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

    extroversion = (extroversion / userInputs.length) * 1.5;
    neurotism = (neurotism / userInputs.length) * 1.5;
    agreeableness = (agreeableness / userInputs.length) * 1.5;
    conscientiousness = (conscientiousness / userInputs.length) * 1.5;
    openness = (openness / userInputs.length) * 1.5;

    console.log(
      "[PERSONALITY_SCORES]",
      extroversion,
      neurotism,
      agreeableness,
      conscientiousness,
      openness
    );

    // Define multipliers for each factor
    const multipliers: { [factor: string]: number } = {
      Extroversion: 3,
      Agreeableness: 4,
      Conscientiousness: 5,
      Neurotism: -3,
      Openness: 3,
      Neutral: 2,
      Happy: 4,
      Sad: -2,
      Angry: -4,
      Surprised: 2,
    };
    const maxPossibleScore = 23;

    // Calculate total score
    let tot = 0;
    for (const factor in multipliers) {
      if (multipliers.hasOwnProperty(factor)) {
        const value = eval(factor.toLowerCase()); // Get value of the factor variable dynamically
        const multiplier = multipliers[factor];
        tot += value * multiplier;
      }
    }

    console.log("Total Score:", tot);

    // Calculate Emotion and Personality Score
    const emotionAndPersonalityScore = (tot / maxPossibleScore) * 100;

    console.log("Emotion and Personality Score:", emotionAndPersonalityScore);

    totalsimilarityScore = (totalsimilarityScore / userInputs.length) * 50;

    const totalScore =
      0.4 * emotionAndPersonalityScore + 0.6 * totalsimilarityScore;

    const interview = await prismadb.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        angry: Math.round(angry * 100) + 1,
        sad: Math.round(sad * 100) + 1,
        neutral: Math.round(neutral * 100) + 1,
        happy: Math.round(happy * 100) + 1,
        surprised: Math.round(surprised * 100) + 1,
        extroversion: Math.round(extroversion * 100) + 1,
        neurotism: Math.round(neurotism * 100) + 1,
        agreeableness: Math.round(agreeableness * 100) + 1,
        conscientiousness: Math.round(conscientiousness * 100) + 1,
        openness: Math.round(openness) + 1,
        totalScore: Math.round(totalScore),
        userAnswers: userInputs,
        similarityScoreList: similarityScoreList,
        similarityScore: Math.round(totalsimilarityScore) + 1,
      },
    });

    console.log("[INTERVIEW_UPDATE]", interview);

    return NextResponse.json("success");
  } catch (error) {
    console.log("[EVALUATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
