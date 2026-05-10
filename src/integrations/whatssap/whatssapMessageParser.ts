import type { IncomingMessage } from "./whatssap.types";
//@ts-expect-error This does not have available type
import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import { config } from "@/config/app.config";

const Whatsapp = new WhatsappCloudAPI({
  accessToken: config.WaAccessToken,
  senderPhoneNumberId: config.WaSenderPhoneNumberId,
  WABA_ID: config.WaWabaId,
});

export class WhatsAppMessageParser {
  static parse(payload: unknown): IncomingMessage {
    const message = Whatsapp.parseMessage(payload);
    console.log(message);

    // {
    //   metadata: {
    //     display_phone_number: '15550295257',
    //     phone_number_id: '290093254179350'
    //   },
    //   contacts: {
    //     profile: { name: 'Rashad' },
    //     wa_id: '233246949634',
    //     user_id: 'GH.1203947121643644'
    //   },
    //   WABA_ID: '252938867909906',
    //   isNotificationMessage: false,
    //   isMessage: true,
    //   message: {
    //     from: { name: 'Rashad', phone: '233246949634' },
    //     from_user_id: 'GH.1203947121643644',
    //     timestamp: '1778405084',
    //     text: { body: 'hi' },
    //     type: 'text_message',
    //     thread: null,
    //     message_id: 'wamid.HBgMMjMzMjQ2OTQ5NjM0FQIAEhgWM0VCMDQxQTU0RDNCMzAzRDc2RTk2QwA='
    //   }
    // }
    return {
      userId: message.message.from,
      message: message.message.text.body,
      images: message.message.images,
    };
  }
}
