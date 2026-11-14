import { Dispatch, SetStateAction } from "react";

export default function useDefault<TStateType>(
  defaultValue: TStateType,
  initialValue: TStateType | (() => TStateType),
): readonly [
  TStateType,
  Dispatch<SetStateAction<TStateType | undefined | null>>,
] {
  throw new Error("Not implemented");
}
