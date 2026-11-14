interface Function {
  myApply(this: any, thisArg: any, argArray?: any[]): any;
}

Function.prototype.myApply = function (thisArg, args) {
  throw new Error("Not implemented!");
};
