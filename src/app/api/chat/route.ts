"use server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

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

    const responseContent =
      completion.choices[0]?.message?.content || "No response received";

    return NextResponse.json({ message: responseContent });
  } catch (error) {
    console.error("DeepSeek error:", error);

    let errorMessage = "Failed to fetch response from DeepSeek";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      if ("status" in error && error.status === 429) {
        errorMessage = "Rate limit exceeded";
        statusCode = 429;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
