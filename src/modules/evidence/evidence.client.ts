import OpenAI from "openai";
import { config } from "@/config/app.config";

export class EvidenceClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.AIApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async generate(prompt: string, imageUrls: string[] = []): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a precise insurance vehicle damage analysis system.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            ...imageUrls.map((url) => ({
              type: "image_url" as const,
              image_url: { url },
            })),
          ],
        },
      ],
    });

    return response?.choices[0]?.message?.content ?? "";
  }
}
