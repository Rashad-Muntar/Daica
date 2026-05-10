import type { ConversationState } from "./conversation.types";
import { ClaimStep } from "./conversation.types";

export class ConversationStateService {
  private sessions = new Map<string, ConversationState>();

  get(userId: string): ConversationState {
    return (
      this.sessions.get(userId) ?? {
        userId,
        step: ClaimStep.START,
        data: {},
      }
    );
  }

  save(userId: string, state: ConversationState): void {
    this.sessions.set(userId, state);
  }

  clear(userId: string): void {
    this.sessions.delete(userId);
  }
}
