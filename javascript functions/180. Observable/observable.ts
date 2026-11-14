export interface Observer<T = unknown> {
  next?(value: T): void;
  error?(error: unknown): void;
  complete?(): void;
}

export interface Subscriber<T = unknown> {
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export type SubscribeInput<T = unknown> = Observer<T> | ((value: T) => void);

export default class Observable<T = unknown> {
  constructor(subscribeFn: (subscriber: Subscriber<T>) => void) {
    throw new Error("Not implemented!");
  }

  subscribe(observer?: SubscribeInput<T>): Subscription {
    throw new Error("Not implemented!");
  }
}
