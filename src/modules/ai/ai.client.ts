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

  async generate(prompt: string): Promise<string> {
    const response = await this.client.responses.create({
      model: "llama-3.3-70b-versatile",
      input: prompt,
    });

    return response.output_text;
  }
}
