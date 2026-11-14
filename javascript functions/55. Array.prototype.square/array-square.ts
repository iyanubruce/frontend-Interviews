interface Array<T> {
  square(): Array<number>;
}

Array.prototype.square = function () {
  throw new Error("Not implemented!");
};
