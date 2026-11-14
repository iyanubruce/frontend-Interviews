type PathSegment = string | number;
type Path = string | Array<PathSegment>;
type Container = Record<PathSegment, unknown> | Array<unknown>;

export default function deepSet(
  obj: Container,
  path: Path,
  value: unknown,
): void {
  throw new Error("Not implemented!");
}
