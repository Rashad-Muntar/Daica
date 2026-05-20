import type { ISendMessage } from "./whatssap.types";
import type { ConversationOrchestrator } from "@/modules/orchestration/conversation.orchestrator";

export class WhatssapService {
  constructor(private orchestrator: ConversationOrchestrator) {}

  processIncomingMessage = async (message: ISendMessage) => {
    if (!message?.recipient?.phone || !message?.msgType) {
      console.error("Invalid message format:", message);
      return;
    }
    try {
      await this.orchestrator.handleMessage(message);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };
}
