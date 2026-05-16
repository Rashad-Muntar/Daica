import type { ConversationState } from "./conversation.types";
import { ClaimStep } from "./conversation.types";
import { createClient } from "redis";

export class ConversationStateService {
  private redis = createClient({
    url: "redis://default:WJ7ESISvw4hbkCbF5ozuDohjausqObDC@earth-adjustment-transparent-36178.db.redis.io:18494",
  });

  constructor() {
    this.connect().catch(console.error);
  }

  async get(userId: string): Promise<ConversationState> {
    // Ensure connection before operation
    if (!this.redis.isOpen) {
      await this.connect();
    }

    const data = await this.redis.get(`session:${userId}`);
    if (!data) {
      return {
        userId,
        currentStep: ClaimStep.START,
        nextStep: ClaimStep.AWAITING_NUMBER,
        lastMessage: "",
        updatedAt: new Date(),
        goBack: "",
        data: {
          vehicleNumber: "",
          policyNumber: "",
          accidentDate: "",
          location: "",
          images: [],
        },
      };
    }
    return JSON.parse(data) as ConversationState;
  }

  async connect(): Promise<void> {
    if (!this.redis.isOpen) {
      await this.redis.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis.isOpen) {
      await this.redis.disconnect();
    }
  }

  async save(userId: string, state: ConversationState): Promise<void> {
    if (!this.redis.isOpen) {
      await this.connect();
    }
    await this.redis.set(`session:${userId}`, JSON.stringify(state), {
      EX: 60 * 60,
    });
  }

  // async clear(userId: string): Promise<void> {
  //   if (!this.redis.isOpen) {
  //     await this.connect();
  //   }
  //   console.log("CELARED", userId)
  //   const rd = await this.redis.del(`session:${userId}`);
  //   console.log(rd)
  // }

   async clear(userId: string): Promise<void> {

    console.log("Redis isOpen:", this.redis.isOpen);
    
    const key = `session:${userId}`;
    
    // Get the value before deletion to verify content
    const value = await this.redis.get(key);
    console.log("Value before deletion:", value);
    
    const rd = await this.redis.del(key);
    console.log("Delete result:", rd);
    
    // Try to get after deletion
    const afterValue = await this.redis.get(key);
    console.log("Value after deletion:", afterValue);
  }
}
