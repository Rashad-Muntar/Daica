import { ClaimRepository } from "@/modules/claims/claim.repository";
import { ClaimService } from "@/modules/claims/claim.service";

import { FraudService } from "@/modules/fraud/fraud.service";
import { FraudRepository } from "@/modules/fraud/fraud.repository";

import { DecisionEngine } from "@/modules/decision/DecisionEngine";

import { ConversationStateService } from "@/modules/conversation/conversation.service";
import { ConversationOrchestrator } from "@/modules/orchestration/conversationOrchestrator";
import { ClaimOrchestrator } from "@/modules/orchestration/claimOrchestrator";
import { ConversationStepHandler } from "@/modules/orchestration/conversationStepHandler";
import { WhatssapClient } from "@/integrations/whatssap/whatssapClient";
import { WhatssapService } from "@/integrations/whatssap/whatsapp.service";

import { WhatsAppMessageParser } from "@/integrations/whatssap/whatssapMessageParser";
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
  const claimService = new ClaimService(claimRepository);
  const fraudService = new FraudService(fraudRepository);
  const decisionEngine = new DecisionEngine();

  const sessionService = new ConversationStateService();

  // ========================
  // ORCHESTRATOR
  // ========================
  const claimOrchest = new ClaimOrchestrator(fraudService, decisionEngine);

  const messageParser = new WhatsAppMessageParser();
  const whatsappClient = new WhatssapClient(messageParser);

  const conversationHandler = new ConversationStepHandler(
    claimService,
    sessionService,
    claimOrchest,
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

  return {
    whatsappService,
  };
}
