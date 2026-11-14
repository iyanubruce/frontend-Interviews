export default function createBreakpoint<T extends Record<string, number>>(
  breakpoints: T,
): () => keyof T {
  throw new Error("Not implemented");
}
