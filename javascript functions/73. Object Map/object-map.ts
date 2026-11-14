export default function objectMap<V, R>(
  obj: Record<string, V>,
  fn: (val: V) => R,
): Record<string, R> {
  throw new Error("Not implemented");
}
