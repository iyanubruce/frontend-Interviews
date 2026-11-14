type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

export default function useQuery<T>(
  queryKey: string,
  fn: () => Promise<T>,
): AsyncState<T> {
  throw new Error("Not implemented");
}
