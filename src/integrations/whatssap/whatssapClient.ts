// import type { ISendMessage } from "./whatssap.types";
import type { IButton } from "./whatssap.types";
import type { WhatsAppMessageParser } from "./whatssapMessageParser";

export class WhatssapClient {
  constructor(private messageParser: WhatsAppMessageParser) {}

  async sendText(recipientPhone: string, message: string) {
    // console.log("Recipient:", recipientPhone,"Message:", message)
    await this.messageParser.sendText(recipientPhone, message);
  }

  async sendImage(
    recipient: string,
    newText: string,
    mediaurl: string,
  ): Promise<void> {
    await this.messageParser.sendImage(recipient, newText, mediaurl);
  }

  async sendSimpleButtons(
    recipient: string,
    newText: string,
    listModel: { listOfButtons: IButton[] },
  ): Promise<void> {
    await this.messageParser.sendSimpleButtons(
      recipient,
      newText,
      listModel.listOfButtons,
    );
  }

  async sendLocationRequest(
    recipientPhone: string,
    bodyText: string,
  ): Promise<void> {
    await this.messageParser.sendLocationRequest(recipientPhone, bodyText);
  }



  async sendRadioButtons(
    recipient: string,
    newText: string,
    listModel: {
      listOfButtons: [];
      headerText: string;
      actionText: string;
      listOfSections: [];
    },
  ): Promise<void> {
    await this.messageParser.sendSimpleRadioButtons(
      recipient,
      newText,
      listModel.headerText,
      listModel.actionText,
      listModel.listOfSections,
    );
  }
}
