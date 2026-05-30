import type { ConversationStateService } from "../conversation/conversation.service";
import type { ISendMessage } from "@/integrations/whatssap/whatssap.types";
import { ConversationStepHandler } from "./conversationStep.orchestrator";
import type { WhatssapClient } from "@/integrations/whatssap/whatssapClient";

export class ConversationOrchestrator {
  constructor(
    private sessionService: ConversationStateService,
    private stepHandler: ConversationStepHandler,
    private client: WhatssapClient,
  ) {}

  handleMessage = async (message: ISendMessage): Promise<void> => {
    const state = await this.sessionService.get(message.recipient.phone);

    const { newState, response, buttons, locationRequest } =
      await this.stepHandler.handleStep(
        state,
        message.messageBody,
        message.mediaurl,
        message.location,
      );

    if (!newState) {
      throw new Error();
    }
    if (!response) {
      throw new Error();
    }

    await this.sessionService.save(message.recipient.phone, newState);

    if (locationRequest) {
      await this.client.sendLocationRequest(message.recipient.phone, response);
    } else if (buttons && buttons.length > 0) {
      await this.client.sendSimpleButtons(message.recipient.phone, response, {
        listOfButtons: buttons,
      });
    } else {
      await this.client.sendText(message.recipient.phone, response);
    }
  };
}
