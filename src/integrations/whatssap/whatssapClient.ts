// import type { ISendMessage } from "./whatssap.types";
import type { WhatsAppMessageParser } from "./whatssapMessageParser";



export class WhatssapClient {
  constructor(private messageParser: WhatsAppMessageParser){
    
  }

async sendText(recipient: string, newText: string): Promise<void> {
  await this.messageParser.sendText(recipient, newText);
}

async sendImage(
  recipient: string,
  newText:   string,
  mediaurl:  string,
): Promise<void> {
  await this.messageParser.sendImage(recipient, newText, mediaurl);
}

// async sendDocument(
//   recipient:        string,
//   newText:          string,
//   mediaurl:         string | Buffer,
//   mediaName?:       string,
//   mediaPlaceHolder?: string,
// ): Promise<void> {
//   if (Buffer.isBuffer(mediaurl)) {
//     const mediaId = await this.MessageUtils.uploadMediaWithBuffer(
//       mediaurl,
//       "MotorPolicyCertificate.pdf",
//     );
//     await this.MessageUtils.sendDocumentWithMediaId(
//       recipient,
//       mediaId,
//       mediaPlaceHolder,
//       mediaName,
//     );
//     return;
//   }
//   await this.messageParser.sendMediaDocument(recipient, newText, mediaurl);
// }

async sendSimpleButtons(
  recipient: string,
  newText:   string,
  listModel: {listOfButtons: []},
): Promise<void> {
  await this.messageParser.sendSimpleButtons(
    recipient,
    newText,
    listModel.listOfButtons,
  );
}

async sendRadioButtons(
  recipient: string,
  newText:   string,
  listModel: {listOfButtons: [], headerText: string, actionText: string, listOfSections: []},
): Promise<void> {
  await this.messageParser.sendSimpleRadioButtons(
    recipient,
    newText,
    listModel.headerText,
    listModel.actionText,
    listModel.listOfSections,
  );
}
};

