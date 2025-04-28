import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY!);

export const aiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
