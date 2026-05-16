// import { WhatssapClient } from "./whatssapClient";
// import type { ISendMessage } from "./whatssap.types";
// import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";

// export class WhatssapService {
//   constructor(
//     private orchestrator: ConversationOrchestrator,
//     private client: WhatssapClient,
//   ) {}
//   processIncomingMessage = async (message: ISendMessage) => {
//   if (!message?.recipient || !message?.msgType) {
//     return;
//   }
//     const response = await this.orchestrator.handleMessage(message);
//     console.log("REA", response)
//     switch (message.msgType) {
//       case "text_message":
//         await this.client.sendText(message.recipient.phone, response);
//         break;
//       case "media_message":
//         console.log("MEDIA RUN")
//         break;
//         // await this.client.sendImage(message.recipient, response)
//       default:
//         console.log("DEFAULT RUN")
//         break;
//     }
//     // await this.client.sendMessage(message);
//   };
// }

// //   const workflows = await this.orchestrator.handleClaimSubmission({
// //       user_id: message.senderId,
// //       description: message.message,
// //       location: "Unknown"
// //   })

// //   await this.client.sendMessage(message.senderId, workflows.decision.reason || "Processed")


// whatssap.service.ts

import { WhatssapClient } from "./whatssapClient";
import type { ISendMessage } from "./whatssap.types";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";

export class WhatssapService {
  constructor(
    private orchestrator: ConversationOrchestrator,
    private client: WhatssapClient,
  ) {}
  
  processIncomingMessage = async (message: ISendMessage) => {
    // Validate message
    if (!message?.recipient?.phone || !message?.msgType) {
      console.error("Invalid message format:", message);
      return;
    }
    
    try {
      // Process through orchestrator
      const response = await this.orchestrator.handleMessage(message);
      
      // Send response based on message type
      if (response) {
        await this.client.sendText(message.recipient.phone, response);
      }
      
    } catch (error) {
      console.error("Error processing message:", error);
      await this.client.sendText(
        message.recipient.phone,
        "Sorry, an error occurred. Please try again."
      );
    }
  };
}