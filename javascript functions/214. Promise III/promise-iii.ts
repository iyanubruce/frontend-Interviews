type PromiseCallback = (value: any) => unknown;

export default class MyPromise {
  constructor(
    executor: (resolve: PromiseCallback, reject: PromiseCallback) => void,
  ) {
    throw new Error("Not implemented!");
  }

  static resolve(value?: any): MyPromise {
    throw new Error("Not implemented!");
  }

  static reject(reason?: any): MyPromise {
    throw new Error("Not implemented!");
  }

  static all(values: Array<any>): MyPromise {
    throw new Error("Not implemented!");
  }

  static race(values: Array<any>): MyPromise {
    throw new Error("Not implemented!");
  }

  then(onFulfilled?: PromiseCallback, onRejected?: PromiseCallback): MyPromise {
    throw new Error("Not implemented!");
  }

  catch(onRejected?: PromiseCallback): MyPromise {
    throw new Error("Not implemented!");
  }

  finally(onFinally?: () => unknown): MyPromise {
    throw new Error("Not implemented!");
  }
}
