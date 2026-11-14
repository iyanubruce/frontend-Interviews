type EventName = "change" | "unset";

interface IBackboneModel {
  get(attribute: string): unknown | undefined;
  set(attribute: string, value: unknown): void;
  has(attribute: string): boolean;
  unset(attribute: string): void;
  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void;
  off(event: EventName, attribute: string, callback: Function): void;
}

// You are free to use alternative approaches of
// defining BackboneModel as long as the
// default export can be instantiated.
export default class BackboneModel implements IBackboneModel {
  constructor(initialValues: Record<string, unknown> = {}) {
    throw new Error("Not implemented!");
  }

  get(attribute: string): unknown | undefined {
    throw new Error("Not implemented!");
  }

  set(attribute: string, value: unknown): void {
    throw new Error("Not implemented!");
  }

  has(attribute: string): boolean {
    throw new Error("Not implemented!");
  }

  unset(attribute: string): void {
    throw new Error("Not implemented!");
  }

  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void {
    throw new Error("Not implemented!");
  }

  off(eventName: EventName, attribute: string, callback: Function): void {
    throw new Error("Not implemented!");
  }
}
