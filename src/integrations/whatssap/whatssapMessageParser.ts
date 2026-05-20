import type { IButton } from "./whatssap.types";
//@ts-expect-error This does not have available type
import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import axios from "axios";
import { config } from "@/config/app.config";
import type { IWarehouse } from "./whatssap.types";
const Whatsapp = new WhatsappCloudAPI({
  accessToken: config.WaAccessToken,
  senderPhoneNumberId: config.WaSenderPhoneNumberId,
  WABA_ID: config.WaWabaId,
});

export class WhatsAppMessageParser {
  static parse(payload: unknown) {
    const message = Whatsapp.parseMessage(payload);

    // Button replies have no message.type but have button_reply
    const isButtonReply = message?.message?.button_reply?.id;
    const msgType =
      message?.message?.type ??
      (isButtonReply ? "simple_button_message" : null);

    if (!msgType) return null;

    // Extract body — for button replies use the button id
    const textBody = isButtonReply
      ? message.message.button_reply.id // ← "start", "question" etc
      : message?.message?.text?.body;

    const images: string[] = message?.message?.image?.url
      ? [message.message.image.url]
      : [];

    return {
      recipient: message.message.from,
      messageBody: {
        ...message.message,
        text: { body: textBody }, // ← normalize into text.body
      },
      messageKey: message.message.message_id,
      mediaurl: images.length > 0 ? images : undefined,
      msgType,
      location:
        message.message.type === "location_message"
          ? {
              latitude: message.message.location?.latitude,
              longitude: message.message.location?.longitude,
              address: message.message.location?.address,
              name: message.message.location?.name,
            }
          : undefined,
    };
  }

  async sendText(recipientPhone: string, message: string) {
    await Whatsapp.sendText({
      recipientPhone: recipientPhone,
      message: message,
    });
  }

  async sendImage(recipientPhone: string, message: string, imagepath: string) {
    await Whatsapp.sendImage({
      recipientPhone: recipientPhone,
      caption: message,
      url: imagepath,
    });
  }

  async sendSimpleButtons(
    recipientPhone: string,
    message: string,
    buttonlist: IButton[],
  ) {
    await Whatsapp.sendSimpleButtons({
      recipientPhone: recipientPhone,
      message: message,
      listOfButtons: buttonlist,
    });
  }

  async sendSimpleRadioButtons(
    recipientPhone: string,
    message: string,
    headerText: string,
    actionText: string,
    listofSections: [],
  ) {
    await Whatsapp.sendRadioButtons({
      recipientPhone: recipientPhone,
      headerText: headerText,
      bodyText: message,
      actionText: actionText,
      footerText: process.env.BOT_NAME,
      listOfSections: listofSections,
    });
  }

  async sendSimpleLocation(recipientPhone: string, warehouse: IWarehouse) {
    await Whatsapp.sendLocation({
      recipientPhone,
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
      address: warehouse.address,
      name: process.env.BOT_NAME,
    });
  }

  async sendLocationRequest(
    recipientPhone: string,
    bodyText: string,
  ): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v25.0/${config.WaSenderPhoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        type: "interactive",
        to: recipientPhone,
        interactive: {
          type: "location_request_message",
          body: {
            text: bodyText,
          },
          action: {
            name: "send_location",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.WaAccessToken}`,
        },
      },
    );
  }

  async sendMediaDocument(
    recipientPhone: string,
    message: string,
    url: string,
  ) {
    await Whatsapp.sendDocument({
      recipientPhone: recipientPhone,
      caption: message,
      url: url,
      filename: message,
    });
  }
}
