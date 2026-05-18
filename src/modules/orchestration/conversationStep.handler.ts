import type { ClaimService } from "../claims/claim.service";
import type { ConversationStateService } from "../conversation/conversation.service";
import type { ConversationState } from "../conversation/conversation.types";
import { ClaimStep } from "../conversation/conversation.types";

export class ConversationStepHandler {
  constructor(
    private claimService: ClaimService,
    private sessionService: ConversationStateService,
  ) {}

  async handleStep(
    state: ConversationState,
    userMessage: any,
    images?: any,
  ): Promise<{ newState: ConversationState; response: string }> {
    userMessage = userMessage.text?.body;

    switch (state.currentStep) {
      case ClaimStep.START:
        return this.handleStart(state, userMessage);

      case ClaimStep.AWAITING_NUMBER:
        return this.handleNumber(state, userMessage);

      case ClaimStep.AWAITING_POLICY_NUMBER:
        return this.handlePolicyNumber(state, userMessage);

      case ClaimStep.AWAITING_DATE:
        return this.handleDate(state, userMessage);

      case ClaimStep.AWAITING_LOCATION:
        return this.handleLocation(state, userMessage);

      case ClaimStep.AWAITING_IMAGES:
        return this.handleImages(state, userMessage, images);

      case ClaimStep.COMPLETE:
        return this.handleComplete(state);

      default:
        return {
          newState: { ...state, currentStep: ClaimStep.START },
          response: "Let's start over. Please send your number.",
        };
    }
  }

  private async handleStart(
    state: ConversationState,
    userMessage: string,
  ): Promise<{ newState: ConversationState; response: string }> {
    // Move to next step only if user is ready
    if (
      userMessage.toLowerCase() === "start" ||
      userMessage.toLowerCase() === "hi"
    ) {
      const newState: ConversationState = {
        ...state,
        currentStep: ClaimStep.AWAITING_NUMBER,
        lastMessage: userMessage,
        updatedAt: new Date(),
      };

      return {
        newState,
        response: "Welcome! Please type 'start' to begin your claim.",
      };
    }

    // Stay on START step until user says "start"
    return {
      newState: state,
      response: "Welcome! Please type 'start' to begin your claim.",
    };
  }

  private async handleNumber(
    state: ConversationState,
    userMessage: string,
  ): Promise<{ newState: ConversationState; response: string }> {
    // Validate phone number

    const newState: ConversationState = {
      ...state,
      currentStep: ClaimStep.AWAITING_POLICY_NUMBER,
      data: { ...state.data, policyNumber: userMessage },
      lastMessage: userMessage,
      updatedAt: new Date(),
    };

    return {
      newState,
      response: "Thank you. Please provide your policy number:",
    };
  }

  private async handlePolicyNumber(
    state: ConversationState,
    userMessage: string,
  ): Promise<{ newState: ConversationState; response: string }> {
    // Validate policy number (customize as needed)
    if (userMessage.length >= 5) {
      const newState: ConversationState = {
        ...state,
        currentStep: ClaimStep.AWAITING_DATE,
        data: { ...state.data, policyNumber: userMessage },
        lastMessage: userMessage,
        updatedAt: new Date(),
      };

      return {
        newState,
        response:
          "When did the incident occur? Please provide the date (DD/MM/YYYY):",
      };
    }

    return {
      newState: state,
      response: "Please provide a valid policy number (minimum 5 characters):",
    };
  }

  private async handleDate(
    state: ConversationState,
    userMessage: string,
  ): Promise<{ newState: ConversationState; response: string }> {
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (dateRegex.test(userMessage)) {
      const newState: ConversationState = {
        ...state,
        currentStep: ClaimStep.AWAITING_LOCATION,
        data: { ...state.data, accidentDate: userMessage },
        lastMessage: userMessage,
        updatedAt: new Date(),
      };

      return {
        newState,
        response:
          "Where did the incident happen? Please share your location or type the address:",
      };
    }

    return {
      newState: state,
      response:
        "Invalid date format. Please use DD/MM/YYYY (e.g., 15/05/2024):",
    };
  }

  private async handleLocation(
    state: ConversationState,
    userMessage: string,
  ): Promise<{ newState: ConversationState; response: string }> {
    const newState: ConversationState = {
      ...state,
      currentStep: ClaimStep.AWAITING_IMAGES,
      data: { ...state.data, location: userMessage },
      lastMessage: userMessage,
      updatedAt: new Date(),
    };

    return {
      newState,
      response:
        "Please take photos of the damage and send them here (you can send multiple):",
    };
  }
  private async handleImages(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<{ newState: ConversationState; response: string }> {
    if (images && images.length > 0) {
      // console.log("jdshfhds", images);
      const currentImages = state.data.images || [];
      const newImages = [...currentImages, ...images];

      const newState: ConversationState = {
        ...state,
        data: { ...state.data, images: newImages },
        currentStep: ClaimStep.COMPLETE,
        lastMessage: userMessage,
        updatedAt: new Date(),
      };

      await this.claimService.createClaim({
        user_id: newState.userId,
        policyNumber: newState.data.policyNumber,
        accidentDate: new Date(newState.data.accidentDate),
        location: newState.data.location,
        images: newState.data.images ?? [],
        status: "PENDING",
      });

      return {
        newState,
        response: " your claim detail. Please wait",
      };
    } else {
      return {
        newState: state,
        response:
          "Please send at least one photo of the damage. Type 'done' when finished.",
      };
    }
  }

  private async handleComplete(
    state: ConversationState,
  ): Promise<{ newState: ConversationState; response: string }> {
    // Check if we should reset or keep in complete state
    const finalState = {
      ...state,
      nextStep: null,
      currentStep: ClaimStep.COMPLETE,
      data: { ...state.data },
    };
    console.log(finalState);
    try {
      await this.claimService.createClaim({
        user_id: finalState.userId,
        policyNumber: finalState.data.policyNumber,
        accidentDate: new Date(finalState.data.accidentDate),
        location: finalState.data.location!,
        images: finalState.data.images ?? [],
        status: "PENDING",
      });

      // ✅ await — clear session after successful claim
      await this.sessionService.clear(finalState.userId);
      return {
        newState: state,
        response: `✅ Your claim is submitted successfully. Our support will contact you shortly to conclude`,
      };
      // return `✅ Your claim has been submitted successfully!\n\nClaim ID: ${claim.user_id}. \n\nWait while we review your claim`;
    } catch (error) {
      console.log(error);
      await this.sessionService.clear(finalState.userId);

      return {
        newState: state,
        response:
          "Your 2 claim has been submitted. We'll contact you soon. Type 'start' to begin a new claim.",
      };
    }
  }
}
