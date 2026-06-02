export interface WebhookPayload {
  status: "completed" | "failed";
  data?: any;
  error?: string;
  timestamp: Date;
}