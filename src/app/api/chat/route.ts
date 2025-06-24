"use server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({
      message:
        completion.choices[0]?.message?.content || "No response received",
    });
  } catch (error) {
    console.error("DeepSeek error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch response from DeepSeek",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
