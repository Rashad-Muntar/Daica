import type { DomainEvent, EventType } from "./event.types";
import { logger } from "@/config/logger";
type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

export class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();

  subscribe<T>(eventType: EventType, handler: EventHandler<T>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    this.handlers.get(eventType)!.push(handler);
  }

  async publish<T>(event: DomainEvent<T>) {
    const handlers = this.handlers.get(event.type);

    if (!handlers) return;

    logger.info({
      event: event.type,
      timestamp: event.timestamp,
      handlers: handlers.length,
      status: "received",
    });

    for (const handler of handlers) {
      const start = Date.now();
      try {
        await handler(event);
        const duration = Date.now() - start;
        logger.info({
          event: event.type,
          durationMs: duration,
          status: "processed",
        });
      } catch (err) {
        logger.error({
          event: event.type,
          status: "failed",
          error: err,
        });
      }
    }
  }
}
