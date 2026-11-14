import { ChangeEvent } from "react";

interface UseInputValueReturn {
  value: string;
  dirty: boolean;
  touched: boolean;
  different: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  reset: () => void;
}

export default function useInputControl(
  initialValue: string,
): UseInputValueReturn {
  throw new Error("Not implemented");
}
