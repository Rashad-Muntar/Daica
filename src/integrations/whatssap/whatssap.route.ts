import { Router } from "express";
import { WhatssappController } from "./whatssap.controller";
import { WhatssapService } from "./whatsapp.service";
// Factory function — accepts the service, returns a configured router
export function createWhatssapRouter(service: WhatssapService): Router {
  const router = Router();
  const controller = new WhatssappController(service); // ← required, not optional

  router.get("/wa_callbackurl", controller.verifyHook);
  router.post("/wa_callbackurl", controller.receivedMessage);
  return router;
}
