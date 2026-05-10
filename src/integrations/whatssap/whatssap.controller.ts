import type { Request, Response } from "express";
import { WhatssapService } from "./whatsapp.service";
import { WhatsAppMessageParser } from "./whatssapMessageParser";
import { config } from "@/config/app.config";

export class WhatssappController {
  constructor(private service: WhatssapService) {}

  verifyHook(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === config.WaVerifytoken) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  }

   receivedMessage = async (req: Request, res: Response) => {
    const parsedMessage = WhatsAppMessageParser.parse(req.body);
    await this.service.processIncomingMessage(parsedMessage);
    return res.sendStatus(200);
  }
}
