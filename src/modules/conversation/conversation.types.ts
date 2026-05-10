// conversation.types.ts

export enum ClaimStep {
  START = "START",
  AWAITING_DESC = "AWAITING_DESC",
  AWAITING_LOCATION = "AWAITING_LOCATION",
  AWAITING_IMAGES = "AWAITING_IMAGES",
  AWAITING_POLICY = "AWAITING_POLICY",
  COMPLETE = "COMPLETE",
}

export interface ConversationState {
  userId: string;
  step: ClaimStep;
  data: {
    description?: string;
    location?: string;
    images?: string[];
    policyNumber?: string;
  };
}

export interface IMessage {
  userId: string;
  message: string;
  images: string[];
}
