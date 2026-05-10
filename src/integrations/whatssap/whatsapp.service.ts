import { WhatssapClient } from "./whatssapClient";
import type { IncomingMessage } from "./whatssap.types";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";

export class WhatssapService {
  constructor(
    private orchestrator: ConversationOrchestrator,
    private client: WhatssapClient,
  ) {}
  processIncomingMessage = async (message: IncomingMessage) => {
     await this.orchestrator.handleMessage(message);
    // switch: 
    // await this.client.sendMessage(message);
  };
}

//   const workflows = await this.orchestrator.handleClaimSubmission({
//       user_id: message.senderId,
//       description: message.message,
//       location: "Unknown"
//   })

//   await this.client.sendMessage(message.senderId, workflows.decision.reason || "Processed")
