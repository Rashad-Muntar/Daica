import { ClaimRepository } from "@/modules/claims/claim.repository";
import { ClaimService } from "@/modules/claims/claim.service";

import { FraudService } from "@/modules/fraud/fraud.service";
import { FraudRepository } from "@/modules/fraud/fraud.repository";

import { DecisionEngine } from "@/modules/decision/DecisionEngine";

import { ConversationStateService } from "@/modules/conversation/conversation.service";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";
import { ConversationStepHandler } from "@/modules/orchestration/conversationStep.handler";
import { WhatssapClient } from "@/integrations/whatssap/whatssapClient";
import { WhatssapService } from "@/integrations/whatssap/whatsapp.service";
import { EventBus } from "@/modules/events/eventBus";
import { WhatsAppMessageParser } from "@/integrations/whatssap/whatssapMessageParser";
import { FraudHandler } from "@/modules/fraud/fraud.handler";
import { AIHandler } from "@/modules/ai/ai.handler";
import { DecisionHandler } from "@/modules/decision/decision.handler";
import { AIService } from "@/modules/ai/ai.service";
import { AIClient } from "@/modules/ai/ai.client";
import { NotificationHandler } from "@/modules/notifications/notification.handler";

/**
 * SINGLE RESPONSIBILITY:
 * Wire all dependencies together.
 */
export function buildAppContainer() {
  // ========================
  // REPOSITORIES
  // ========================
  const claimRepository = new ClaimRepository();
  const fraudRepository = new FraudRepository();

  // ========================
  // SERVICES
  // ========================
  const eventBus = new EventBus();
  const claimService = new ClaimService(claimRepository, eventBus);

  const fraudService = new FraudService(fraudRepository);
  const sessionService = new ConversationStateService();
  const aiClient = new AIClient();
  const aiService = new AIService(aiClient);
  // ========================
  // ORCHESTRATOR
  // ========================

  const messageParser = new WhatsAppMessageParser();
  const whatsappClient = new WhatssapClient(messageParser);

  const conversationHandler = new ConversationStepHandler(
    claimService,
    sessionService,
  );

  const conversationOrchestrator = new ConversationOrchestrator(
    conversationHandler,
    sessionService,
  );

  // ========================
  // WHATSAPP
  // ========================

  const whatsappService = new WhatssapService(
    conversationOrchestrator,
    whatsappClient,
  );

  // ====================
  // EVENT HANDLERS
  // ====================
  const decisionEngine = new DecisionEngine();

  const fraudHandler = new FraudHandler(eventBus, fraudService);

  const aiHandler = new AIHandler(eventBus, aiService);

  const decisionHandler = new DecisionHandler(eventBus, decisionEngine);
  const notificationHandler = new NotificationHandler(eventBus, whatsappClient)
  fraudHandler.register();
  aiHandler.register();
  decisionHandler.register();
  notificationHandler.register()

  return {
    whatsappService,
  };
}
