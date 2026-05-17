// conversation.types.ts

export enum ClaimStep {
  START = "START",
  AWAITING_NUMBER = "AWAITING_NUMBER",
  AWAITING_POLICY_NUMBER = "AWAITING_POLICY_NUMBER",
  AWAITING_DATE = "AWAITING_DATE",
  AWAITING_LOCATION = "AWAITING_LOCATION",
  AWAITING_IMAGES = "AWAITING_IMAGES",
  COMPLETE = "COMPLETE",
}

export interface ConversationState {
  userId: string;
  currentStep: ClaimStep;
  nextStep: ClaimStep;
  lastMessage: string;
  updatedAt: Date;
  goBack: string;
  data: {
    policyNumber: string;
    accidentDate: string;
    location: string;
    images?: string[];
  };
}

export interface IMessage {
  userId: string;
  message: string;
  images: string[];
}
