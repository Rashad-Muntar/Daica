import type { DomainEvent, EventType } from "./event.types";

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

export class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();

  subscribe<T>(
    eventType: EventType,
    handler: EventHandler<T>,
  ) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    this.handlers.get(eventType)!.push(handler);
  }

  async publish<T>(event: DomainEvent<T>) {
    const handlers = this.handlers.get(event.type);

    if (!handlers) return;

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(
          `Event handler failed for ${event.type}`,
          err,
        );
      }
    }
  }
}