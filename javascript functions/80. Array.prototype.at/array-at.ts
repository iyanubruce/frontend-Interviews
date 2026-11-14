interface Array<T> {
  myAt(index: number): T | undefined;
}

Array.prototype.myAt = function (index: number) {
  throw new Error("Not implemented!");
};
