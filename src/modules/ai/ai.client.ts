import OpenAI from "openai";
import { config } from "@/config/app.config";

export class AIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.AIApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  // ← text only — for prompts without images
  async generate(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "You are a precise insurance claims analysis system.",
        },
        {
          role: "user",
          content: prompt, // ← plain string, no array
        },
      ],
    });
    return response?.choices[0]?.message?.content ?? "";
  }

  // ← vision — for prompts that include images
  async generateWithImages(
    prompt: string,
    imageUrls: string[],
  ): Promise<string | ""> {
    try {
      const response = await this.client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // ← vision model
        messages: [
          {
            role: "system",
            content:
              "You are a precise insurance vehicle damage analysis system.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...imageUrls.map((url) => ({
                type: "image_url" as const,
                image_url: { url },
              })),
            ],
          },
        ],
      });
      return response?.choices[0]?.message?.content ?? "";
    } catch (error) {
      console.error("Error during AI generation:", error);
      return "";
    }
  }
}
