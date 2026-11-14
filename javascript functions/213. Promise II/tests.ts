import { describe, test, expect } from "vitest";

import MyPromise from "./promise-ii";

describe("MyPromise", () => {
  test("chains fulfilled values", async () => {
    const result = await new MyPromise((resolve: Function) => {
      resolve(2);
    })
      .then((value: number) => value + 3)
      .then((value: number) => value * 4);

    expect(result).toBe(20);
  });

  test("recovers from rejections with catch", async () => {
    const result = await new MyPromise((_: Function, reject: Function) => {
      reject("failed");
    }).catch((reason: string) => `Recovered from ${reason}`);

    expect(result).toBe("Recovered from failed");
  });

  test("adopts returned promises", async () => {
    const result = await new MyPromise((resolve: Function) => {
      resolve(5);
    }).then(
      (value: number) =>
        new MyPromise((resolve: Function) => {
          setTimeout(() => {
            resolve(value * 2);
          }, 0);
        }),
    );

    expect(result).toBe(10);
  });
});
