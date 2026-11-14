interface CommandSpec {
  $set?: unknown;
  $apply?: (currentValue: any) => unknown;
}

interface TraversalSpec {
  [key: string]: Spec;
}

type Spec = CommandSpec | TraversalSpec;

export default function update<T extends Record<string, unknown>>(
  target: T,
  spec: Spec,
): T {
  throw new Error("Not implemented!");
}
