export default function negate<P extends Array<any>>(
  predicate: (this: any, ...args: P) => boolean,
): (...args: P) => boolean {
  throw new Error("Not implemented!");
}
