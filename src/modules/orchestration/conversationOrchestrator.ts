import { ConversationStateService } from "../conversation/conversation.service";
import type { ISendMessage } from "@/integrations/whatssap/whatssap.types";
import { ConversationStepHandler } from "./conversationStepHandler";
export class ConversationOrchestrator {
  constructor(
    private stepHandler: ConversationStepHandler,
    private sessionService: ConversationStateService,
  ) {}

  handleMessage = async (message: ISendMessage): Promise<string> => {
    try {
      const state = await this.sessionService.get(message.recipient.phone);

      let userMessage = "";

      userMessage = message.messageBody as any;
      // console.log(message.messageBody);
      const images = message.messageBody.image
        ? [message.messageBody.image?.url]
        : undefined;

      const { newState, response } = await this.stepHandler.handleStep(
        state,
        userMessage,
        images,
      );

      await this.sessionService.save(message.recipient.phone, newState);

      return response;
    } catch (error) {
      console.error("Error handling message:", error);
      return "An error occurred. Please try again or type 'start' to restart.";
    }
  };
}
