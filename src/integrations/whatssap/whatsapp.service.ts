import { WhatssapClient } from "./whatssapClient";
import type { ISendMessage } from "./whatssap.types";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";

// media_message
// text_message
// 

export class WhatssapService {
  constructor(
    private orchestrator: ConversationOrchestrator,
    private client: WhatssapClient,
  ) {}
  processIncomingMessage = async (message: ISendMessage) => {
   const response = await this.orchestrator.handleMessage(message);
    console.log(response)
    switch (message.msgType){
      case "text_message":
        await this.client.sendText(message.recipient, response)
    }
    // await this.client.sendMessage(message);
  };
}

//   const workflows = await this.orchestrator.handleClaimSubmission({
//       user_id: message.senderId,
//       description: message.message,
//       location: "Unknown"
//   })

//   await this.client.sendMessage(message.senderId, workflows.decision.reason || "Processed")
