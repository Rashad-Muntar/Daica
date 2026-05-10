import type { IncomingMessage } from "./whatssap.types";
//@ts-expect-error This does not have available type
import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import { config } from "@/config/app.config";
import type { IWarehouse } from "./whatssap.types";
const Whatsapp = new WhatsappCloudAPI({
  accessToken: config.WaAccessToken,
  senderPhoneNumberId: config.WaSenderPhoneNumberId,
  WABA_ID: config.WaWabaId,
});

export class WhatsAppMessageParser {
  static parse(payload: unknown): IncomingMessage {
    const message = Whatsapp.parseMessage(payload);
    console.log(message);
    return {
      userId: message.message.from,
      message: message.message.text.body,
      images: message.message.images,
    };
  }

  async sendText(recipientPhone:string, message:string) {
    await Whatsapp.sendText({
        recipientPhone: recipientPhone,
        message: message,
    });
}

async  sendImage(recipientPhone:string, message:string, imagepath:string) {
    await Whatsapp.sendImage({
        recipientPhone: recipientPhone,
        caption: message,
        url: imagepath,
    });

}

async  sendSimpleButtons(recipientPhone:string, message:string, buttonlist:[]) {
    await Whatsapp.sendSimpleButtons({
        recipientPhone: recipientPhone,
        message: message,
        listOfButtons: buttonlist
    });

}

async sendSimpleRadioButtons(recipientPhone:string, message:string, headerText:string, actionText:string, listofSections: []) {
    await Whatsapp.sendRadioButtons({
        recipientPhone: recipientPhone,
        headerText: headerText,
        bodyText: message,
        actionText: actionText,
        footerText: process.env.BOT_NAME,
        listOfSections: listofSections
    });

}

async  sendSimpleLocation(recipientPhone:string, warehouse:IWarehouse) {
    await Whatsapp.sendLocation({
        recipientPhone,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        address: warehouse.address,
        name: process.env.BOT_NAME,
    });

}

async  sendMediaDocument(recipientPhone:string, message:string, url:string) {
    await Whatsapp.sendDocument({
        recipientPhone: recipientPhone,
        caption: message,
        url: url,
        filename: message,
    });
}
}
