interface Array<T> {
  myConcat(...items: Array<T | Array<T>>): Array<T>;
}

Array.prototype.myConcat = function (...items) {
  throw new Error("Not implemented!");
};
