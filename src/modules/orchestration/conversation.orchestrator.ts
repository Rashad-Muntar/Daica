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
// {
//   recipient: { name: 'Rashad', phone: '233246949634' },
//   messageBody: {
//     from: { name: 'Rashad', phone: '233246949634' },
//     from_user_id: 'GH.1203947121643644',
//     timestamp: '1779289728',
//     type: 'media_message',
//     image: {
//       mime_type: 'image/jpeg',
//       sha256: 'OuvHuRvti0Hg9m1iyVjr+W9P7Z7R7YFr5oWKFlGIvGk=',
//       id: '26524828817187683',
//       url: 'https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=26524828817187683&source=webhook&ext=1779290030&hash=ARlFqVtCpGX3PihaUd_TFPYZ6h8FpfL6d-xXQUE2dM-4uA'
//     },
//     thread: null,
//     message_id: 'wamid.HBgMMjMzMjQ2OTQ5NjM0FQIAEhgWM0VCMEQ4NjA5NDkyQUYxNjk5MEM3NgA=',
//     text: { body: undefined }
//   },
//   messageKey: 'wamid.HBgMMjMzMjQ2OTQ5NjM0FQIAEhgWM0VCMEQ4NjA5NDkyQUYxNjk5MEM3NgA=',
//   mediaurl: undefined,
//   msgType: 'media_message',
//   location: undefined
// }
    // ← is this block present?
    if (locationRequest) {
      await this.client.sendLocationRequest(message.recipient.phone, response);
    } else if (buttons && buttons.length > 0) {
      await this.client.sendSimpleButtons(message.recipient.phone, response, {
        listOfButtons: buttons,
      });
    }
     else {
      await this.client.sendText(message.recipient.phone, response);
    }
  };
}
