interface IEventEmitter {
  on(eventName: string, listener: Function): { off: () => void };
  emit(eventName: string, ...args: Array<any>): boolean;
}

// You are free to use alternative approaches of
// instantiating the EventEmitter as long as the
// default export is correct.
export default class EventEmitter implements IEventEmitter {
  constructor() {
    throw new Error("Not implemented!");
  }

  on(eventName: string, listener: Function): { off: () => void } {
    throw new Error("Not implemented!");
  }

  emit(eventName: string, ...args: Array<any>): boolean {
    throw new Error("Not implemented!");
  }
}
