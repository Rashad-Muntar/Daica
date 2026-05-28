import type { ConversationState } from "../conversation/conversation.types";

export type StepResult = {
  newState: ConversationState | undefined;
  response: string | undefined;
  buttons?: { title: string; id: string }[] | undefined;
  locationRequest?: boolean | undefined;
};