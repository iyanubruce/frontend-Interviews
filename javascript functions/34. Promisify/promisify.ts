export default function promisify<T>(
  func: (...args: any[]) => void,
): (this: any, ...args: any[]) => Promise<T> {
  throw new Error("Not implemented");
}
