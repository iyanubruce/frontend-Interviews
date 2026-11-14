export default function objectUpdate<T extends Record<string, unknown>>(
  source: T,
  path: string | Array<string | number>,
  valueOrUpdater: unknown,
): T {
  throw new Error("Not implemented!");
}
