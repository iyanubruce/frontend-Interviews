interface IEventEmitter {
  on(eventName: string, listener: Function): IEventEmitter;
  off(eventName: string, listener: Function): IEventEmitter;
  emit(eventName: string, ...args: Array<any>): boolean;
}

// You are free to use alternative approaches of
// instantiating the EventEmitter as long as the
// default export has the same interface.
export default class EventEmitter implements IEventEmitter {
  constructor() {
    throw new Error("Not implemented!");
  }

  on(eventName: string, listener: Function): IEventEmitter {
    throw new Error("Not implemented!");
  }

  off(eventName: string, listener: Function): IEventEmitter {
    throw new Error("Not implemented!");
  }

  emit(eventName: string, ...args: Array<any>): boolean {
    throw new Error("Not implemented!");
  }
}
