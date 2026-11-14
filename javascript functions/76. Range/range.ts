export default function range(end: number): Array<number>;
export default function range(
  start: number,
  end: number,
  step?: number,
): Array<number>;

export default function range(
  start: number = 0,
  end?: number,
  step: number = 1,
): Array<number> {
  throw new Error("Not implemented!");
}
