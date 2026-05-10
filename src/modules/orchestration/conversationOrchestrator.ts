import { ClaimService } from "../claims/claim.service";
import { ConversationStateService } from "../conversation/conversation.service";
import { ClaimStep } from "../conversation/conversation.types";
import type {
  ConversationState,
} from "../conversation/conversation.types";
import type { ISendMessage } from "@/integrations/whatssap/whatssap.types";

export class ConversationOrchestrator {
  constructor(
    private claimService: ClaimService,
    private sessionService: ConversationStateService,
  ) {}

  handleMessage = async (message: ISendMessage): Promise<string> => {
    const state = this.sessionService.get(message.recipient);

    switch (state.step) {
      case ClaimStep.START:
        return this.handleStart(message.recipient, state);

      case ClaimStep.AWAITING_DESC:
        return this.handleDescription(message.recipient, message.messageBody, state);

      case ClaimStep.AWAITING_LOCATION:
        return this.handleLocation(message.recipient, message.messageBody, state);

      case ClaimStep.AWAITING_IMAGES:
        if(!message.mediaurl){
          throw new Error()
        }
        return this.handleImages(message.recipient, message.mediaurl, state);

      case ClaimStep.AWAITING_POLICY:
        return this.handlePolicy(message.recipient, message.messageBody, state);

      default:
        this.sessionService.clear(message.recipient);
        return "Something went wrong. Type *start* to begin again.";
    }
  };

  private handleStart(userId: string, state: ConversationState): string {
    // Move to next step
    this.sessionService.save(userId, {
      ...state,
      step: ClaimStep.AWAITING_DESC,
    });
    return "Hello! Please describe what happened to your vehicle.";
  }

  private handleDescription(
    userId: string,
    message: string,
    state: ConversationState,
  ): string {
    // Save description, move to next step
    this.sessionService.save(userId, {
      ...state,
      step: ClaimStep.AWAITING_LOCATION,
      data: { ...state.data, description: message },
    });
    return "Where did this happen? Please provide the location.";
  }

  private handleLocation(
    userId: string,
    message: string,
    state: ConversationState,
  ): string {
    // Save location, move to next step
    this.sessionService.save(userId, {
      ...state,
      step: ClaimStep.AWAITING_IMAGES,
      data: { ...state.data, location: message },
    });
    return "Please send photos of the damage.";
  }

  private async handleImages(
    userId: string,
    images: string[],
    state: ConversationState,
  ): Promise<string> {
    if (!images || images.length === 0) {
      return "Please send at least one photo of the damage.";
    }

    // Save images, move to next step
    this.sessionService.save(userId, {
      ...state,
      step: ClaimStep.AWAITING_POLICY,
      data: { ...state.data, images },
    });
    return "Thank you! What is your policy number?";
  }

  private async handlePolicy(
    userId: string,
    message: string,
    state: ConversationState,
  ): Promise<string> {
    // All data collected — NOW create the claim
    const finalState = {
      ...state,
      step: ClaimStep.COMPLETE,
      data: { ...state.data, policyNumber: message },
    };

    try {
      // ✅ Only NOW do we have enough data to create a claim
      const claim = await this.claimService.createClaim({
        user_id: userId,
        description: finalState.data.description!,
        location: finalState.data.location!,
        images: finalState.data.images ?? [],
        status: "PENDING",
      });

      return `✅ Your claim has been submitted successfully!\n\nClaim ID: ${claim.user_id}`;
    } catch (err) {
      this.sessionService.clear(userId);
      console.log("EROROOR", err)
      return `${err}`;
    }
  }
}
