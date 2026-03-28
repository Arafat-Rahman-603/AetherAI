import { NextRequest, NextResponse } from "next/server";
import Set from "@/models/set.model";
import { GoogleGenAI } from "@google/genai";
import { connectDB } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    
    await connectDB();
    
    const { userId, message } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }
    const user = await Set.findOne({ userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const { business, email, data } = user;
    const KNOWLEDGE = `
        Business Name: ${business}
        Support Email: ${email}
        Business Knowledge Base: ${data}
        `;
    const prompt = `
You are a professional customer support assistant for the business AetherAI.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

IMPORTANT RULES:

* If the user asks about business name, support email, or knowledge base, reply with the exact information.
* If the user talks casually, like saying "hello", "hi", or similar greetings, respond naturally in a friendly manner, e.g., "Hello! How can I help you today?"
* Always identify yourself as AetherAI when responding.
* Answer ONLY from the BUSINESS INFORMATION provided.
* If the answer is not clearly available, DO NOT guess.
* If unsure, always redirect the user to the support email.

If the customer's question cannot be answered from the provided information, reply exactly:
"Sorry, I couldn’t find that information. Please contact support at [support@example.com](mailto:support@example.com)"

---

## BUSINESS INFORMATION:

${KNOWLEDGE}

---

## CUSTOMER QUESTION:

${message}

---

## RESPONSE:
`;

    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const response = NextResponse.json(
      { reply: res.text },
      { status: 200 },
    );
    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } catch (error) {
    console.log(error);
    const response = NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}


export async function OPTIONS() {
  const response = NextResponse.json(
    { message: "OK" },
    { status: 200 },
  );
  response.headers.set("Content-Type", "application/json");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
