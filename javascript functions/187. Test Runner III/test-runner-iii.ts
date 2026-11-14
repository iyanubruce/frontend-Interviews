export type RunResult = {
  total: number;
  passed: number;
  failed: number;
  results: Array<
    | { name: string; status: "passed" }
    | { name: string; status: "failed"; error: string }
  >;
};

export default function createTestRunner() {
  throw new Error("Not implemented!");
}
