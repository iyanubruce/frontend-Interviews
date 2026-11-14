interface Array<T> {
  myWith(index: number, value: T): T[];
}

Array.prototype.myWith = function <T>(this: T[], index: number, value: T): T[] {
  throw new Error("Not implemented!");
};
