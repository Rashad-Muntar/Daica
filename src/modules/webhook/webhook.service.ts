import axios from "axios";
import { logger } from "@/config/logger";
import type { WebhookPayload } from "./webhook.types";


export class WebhookService {
  async send(callbackUrl: string, payload: WebhookPayload): Promise<void> {
    try {
      console.log("Sending webhook to:", callbackUrl, "with payload:", payload); // ← log outgoing webhook
      await axios.post(callbackUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-DAICA-Webhook": "true",
        },
        timeout: 10000, // 10 seconds
      });

      logger.info({
        event:       "WEBHOOK_SENT",
        callbackUrl,
        status:      payload.status,
      });
    } catch (err) {
      logger.error({
        event:       "WEBHOOK_FAILED",
        callbackUrl,
        error:       err,
      });
      // Don't throw — webhook failure shouldn't crash the pipeline
    }
  }
}