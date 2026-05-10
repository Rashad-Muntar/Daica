import { WhatssapClient } from "./whatssapClient";
import type { IncomingMessage } from "./whatssap.types";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";

export class WhatssapService {
  constructor(
    private orchestrator: ConversationOrchestrator,
    private client: WhatssapClient,
  ) {}
  processIncomingMessage = async (message: IncomingMessage) => {
    const response = await this.orchestrator.handleMessage(
    message
    );

    await this.client.sendMessage(message.userId, response);
  
  }
}


    //   const workflows = await this.orchestrator.handleClaimSubmission({
    //       user_id: message.senderId,
    //       description: message.message,
    //       location: "Unknown"
    //   })

      //   await this.client.sendMessage(message.senderId, workflows.decision.reason || "Processed")