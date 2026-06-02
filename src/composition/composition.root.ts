import { ClaimRepository } from "@/modules/claims/claim.repository";
import { ClaimService } from "@/modules/claims/claim.service";
import { FraudService } from "@/modules/fraud/fraud.service";
import { FraudRepository } from "@/modules/fraud/fraud.repository";
import { FraudRules } from "@/modules/fraud/fraudRules";
import { DecisionEngine } from "@/modules/decision/DecisionEngine";
import { DocumentFraudService } from "@/modules/fraud/docsFraud.service";
import { ConversationStateService } from "@/modules/conversation/conversation.service";
import { ConversationOrchestrator } from "@/modules/orchestration/conversation.orchestrator";
import { ConversationStepHandler } from "@/modules/orchestration/conversationStep.orchestrator";
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
import { AuditHandler } from "@/modules/audit/audit.handler";
import { AuditService } from "@/modules/audit/audit.service";
import { AuditRepository } from "@/modules/audit/audit.repository";
import { CloudinaryService } from "@/integrations/cloudinary/cloudinary.service";
import { CloudinaryClient } from "@/integrations/cloudinary/cloudinaty.client";
import { ClaimController } from "@/modules/api/claims/claims.controller";
import { WebhookService } from "@/modules/webhook/webhook.service";
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
  const auditRepository = new AuditRepository();


  //=============
  // CLIENTS
  //=============
  const sessionService = new ConversationStateService();
  const aiClient = new AIClient();

  // ========================
  // SERVICES
  // ========================
  const webhookService = new WebhookService();
  const aiService = new AIService(aiClient);
  const documentFraudService = new DocumentFraudService(
    aiService,
    claimRepository,
  );
  const cloudinryClient = new CloudinaryClient();
  const cloudinaryService = new CloudinaryService(cloudinryClient);
  const eventBus = new EventBus();
  const claimService = new ClaimService(
    claimRepository,
    eventBus,
    documentFraudService,
  );
  const conversationHandler = new ConversationStepHandler(
    claimService,
    sessionService,
    cloudinaryService,
  );

  const fraudRules = new FraudRules(documentFraudService, claimRepository);
  const fraudService = new FraudService(fraudRepository, fraudRules);

  const auditService = new AuditService(auditRepository);

  // ========================
  // ORCHESTRATOR
  // ========================

  const messageParser = new WhatsAppMessageParser();
  const whatsappClient = new WhatssapClient(messageParser);

  const conversationOrchestrator = new ConversationOrchestrator(
    sessionService,
    conversationHandler,
    whatsappClient,
  );

  // ========================
  // WHATSAPP
  // ========================

  const whatsappService = new WhatssapService(
    conversationOrchestrator,
    // whatsappClient,
  );
  const claimsController = new ClaimController(
    claimService,
    cloudinaryService,
  );

  // ====================
  // EVENT HANDLERS
  // ====================
  const decisionEngine = new DecisionEngine();

  const fraudHandler = new FraudHandler(eventBus, fraudService);

  const aiHandler = new AIHandler(eventBus, aiService);

  const decisionHandler = new DecisionHandler(eventBus, decisionEngine, webhookService);
  const notificationHandler = new NotificationHandler(eventBus, whatsappClient);
  const auditHandler = new AuditHandler(eventBus, auditService);

  fraudHandler.register();
  aiHandler.register();
  decisionHandler.register();
  notificationHandler.register();
  auditHandler.register();

  return {
    whatsappService,
    claimsController,
  };
}
