import { describe, test, expect } from "vitest";

import Observable from "./observable";

describe("Observable", () => {
  describe("subscribe()", () => {
    test("runs the source lazily for each subscription", () => {
      let runs = 0;
      const first: Array<number> = [];
      const second: Array<number> = [];
      const observable = new Observable<number>((subscriber) => {
        runs += 1;
        subscriber.next(runs);
      });

      expect(runs).toBe(0);

      observable.subscribe((value) => {
        first.push(value);
      });
      observable.subscribe((value) => {
        second.push(value);
      });

      expect(first).toEqual([1]);
      expect(second).toEqual([2]);
      expect(runs).toBe(2);
    });

    test("ignores notifications after complete", () => {
      const events: Array<string> = [];
      const observable = new Observable<number>((subscriber) => {
        subscriber.next(1);
        subscriber.complete();
        subscriber.next(2);
      });

      observable.subscribe({
        next(value) {
          events.push(`next:${value}`);
        },
        complete() {
          events.push("complete");
        },
      });

      expect(events).toEqual(["next:1", "complete"]);
    });

    test("unsubscribe suppresses later async notifications", (done) => {
      expect.assertions(1);
      const values: Array<string> = [];
      const observable = new Observable<string>((subscriber) => {
        setTimeout(() => subscriber.next("later"), 10);
      });

      const subscription = observable.subscribe((value) => {
        values.push(value);
      });

      subscription.unsubscribe();

      setTimeout(() => {
        expect(values).toEqual([]);
        done();
      }, 20);
    });
  });
});
