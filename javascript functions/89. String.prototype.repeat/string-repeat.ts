interface String {
  myRepeat(count?: number): string;
}

String.prototype.myRepeat = function (this: unknown, count?: number) {
  throw new Error("Not implemented!");
};
