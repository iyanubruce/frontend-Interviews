type SumResult = (value?: number) => number | SumResult;

export default function sum(value: number): SumResult {
  throw new Error("Not implemented!");
}
