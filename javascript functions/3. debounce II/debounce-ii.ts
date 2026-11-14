interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export default function debounce(
  func: Function,
  wait?: number,
): DebouncedFunction {
  throw new Error("Not implemented!");
}
