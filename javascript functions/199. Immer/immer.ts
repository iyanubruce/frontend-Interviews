export default function produce<T extends Record<string, unknown>>(
  baseState: T,
  recipe: (draft: T) => void,
): T {
  throw new Error("Not implemented!");
}
