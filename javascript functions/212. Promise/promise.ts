type PromiseCallback = (value: any) => unknown;

export default class MyPromise {
  constructor(
    executor: (resolve: PromiseCallback, reject: PromiseCallback) => void,
  ) {
    throw new Error("Not implemented!");
  }

  then(onFulfilled?: PromiseCallback, onRejected?: PromiseCallback): void {
    throw new Error("Not implemented!");
  }
}
