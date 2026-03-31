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

    const { business, email, data, backendUrl } = user;
    let products = user.products;

    const now = Date.now();
    
    // Check if products are missing or older than 24 hours, and refetch
    if (backendUrl && (!products || products.lastUpdated + 86400000 < now)) {
      try {
        const res = await fetch(backendUrl);
        const fetchedProducts = await res.json();

        let productList: { name?: string; title?: string; price?: string | number; amount?: string | number }[] = [];
        if (Array.isArray(fetchedProducts)) {
          productList = fetchedProducts;
        } else if (fetchedProducts && typeof fetchedProducts === "object") {

          const arrayProp = Object.values(fetchedProducts).find(val => Array.isArray(val));
          if (arrayProp) {
            productList = arrayProp as { name?: string; title?: string; price?: string | number; amount?: string | number }[];
          }
        }

        const productsData = productList.slice(0, 30).map((item: { name?: string; title?: string; price?: string | number; amount?: string | number }) => ({
          name: item?.name || item?.title || "No Name",
          price: item?.price || item?.amount || 0,
        }));

        products = {
          data: productsData,
          lastUpdated: now,
        };

        await Set.findOneAndUpdate({ userId },{ $set:{ products }}, { new: true });
      } catch (err) {
        console.error("Product background fetch error:", err);
      }
    }

    const KNOWLEDGE = `
Business Name: ${business}
Support Email: ${email}
Business Knowledge Base: ${data}
Products: ${products?.data ? JSON.stringify(products.data) : "No specific products listed"}`;

    const prompt = `
You are AetherAI, a professional customer support assistant.

Use ONLY the information provided below.
Do NOT make up anything.

Rules:
- Always identify as AetherAI
- Answer clearly and shortly
- If user needs in other language than bangla, answer in that language
- You can use your own intelligence to answer the question but depend on the knowledge base
- If unsure → tell user to contact support email
- Use the knowledge base to answer questions, and give recommendations or suggestions when asked
- If a user asks how many products are available, reply: ‘More than [number] products are available’ based on your knowledge base.
---

BUSINESS INFO:
${KNOWLEDGE}

---

USER QUESTION:
${message}

---

RESPONSE:
`;

    // 🔥 API KEYS ROTATION
    const keys = [
      process.env.GEMINI_API_KEY_MD_5,
      process.env.GEMINI_API_KEY_MD_6,
      process.env.GEMINI_API_KEY_MD_7,
      process.env.GEMINI_API_KEY_MD_8,
      process.env.GEMINI_API_KEY_MD_9,
      process.env.GEMINI_API_KEY_MD_10,
      process.env.GEMINI_API_KEY_NOOR,
      process.env.GEMINI_API_KEY_603,
      process.env.GEMINI_API_KEY_SRISTY,
      process.env.GEMINI_API_KEY_306,
      process.env.GEMINI_API_KEY_MD,
      process.env.GEMINI_API_KEY_306_2,
      process.env.GEMINI_API_KEY_306_3,
      process.env.GEMINI_API_KEY_306_4,
      process.env.GEMINI_API_KEY_306_5,
      process.env.GEMINI_API_KEY_306_6,
      process.env.GEMINI_API_KEY_306_7,
      process.env.GEMINI_API_KEY_306_8,
      process.env.GEMINI_API_KEY_306_9,
      process.env.GEMINI_API_KEY_MD_2,
      process.env.GEMINI_API_KEY_MD_3,
      process.env.GEMINI_API_KEY_MD_4,
      process.env.GEMINI_API_KEY_MD_11,
      process.env.GEMINI_API_KEY_MD_12,
      process.env.GEMINI_API_KEY_MD_13,
      process.env.GEMINI_API_KEY_MD_14,
      process.env.GEMINI_API_KEY_MD_15,
      process.env.GEMINI_API_KEY_MD_16,
      process.env.GEMINI_API_KEY_MD_17,
      process.env.GEMINI_API_KEY_MD_18,
      process.env.GEMINI_API_KEY_MD_19,
      process.env.GEMINI_API_KEY_MD_20,

    ].filter(Boolean) as string[];

    let res;
    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        break;
      } catch (err) {
        console.error("API key failed:", err);
        continue;
      }
    }

    if (!res) throw new Error("All API keys failed");
    const response = NextResponse.json({ reply: res.text });
    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } catch (error) {
    console.error("Error:", error);
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
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
