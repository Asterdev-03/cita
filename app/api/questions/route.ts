import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const prompt = await req.json();

    const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    /*     const prompt = "Write a story about a magic backpack."; */

    console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    return NextResponse.json(text);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
