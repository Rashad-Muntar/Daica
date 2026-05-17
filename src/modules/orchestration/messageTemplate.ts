import type { ConversationState } from "../conversation/conversation.types";
import { ClaimStep } from "../conversation/conversation.types";

export class Messages {
  static START(state: ConversationState, message: any) {
    const current = "Welcome! Please type 'start' to begin your claim.";
    const next = this.AWAITING_NUMBER;
    let newState: ConversationState = state;
    const onAnswered = () => {
      newState = {
        ...state,
        currentStep: ClaimStep.AWAITING_NUMBER,
        lastMessage: message,
        updatedAt: new Date(),
      };
    };
    return { newState, response: { current, next, onAnswered } };
  }
  
  static AWAITING_NUMBER(state: ConversationState, message: any) {
    const current = "Please provide your policy number";
    const next = null;
    let newState: ConversationState = state;
    const onAnswered = () => {
      newState = {
        ...state,
        currentStep: ClaimStep.AWAITING_POLICY_NUMBER,
        data: { ...state.data, policyNumber: message },
        lastMessage: message,
        updatedAt: new Date(),
      };
    };
    console.log(newState);
    return { newState, response: { current, next, onAnswered } };
  }

  //   AWAITING_NUMBER: {},
  //   AWAITING_POLICY_NUMBER: {},
  //   AWAITING_DATE: {},
  //   AWAITING_LOCATION: {},
  //   AWAITING_IMAGES: {},
  //   COMPLETE: {},
}
