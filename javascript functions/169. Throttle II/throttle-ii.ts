export type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

type ThrottleCallback<TArgs extends Array<any>, TResult> = (
  this: any,
  ...args: TArgs
) => TResult;

export type ThrottledFunction<TArgs extends Array<any>, TResult> = ((
  this: any,
  ...args: TArgs
) => TResult | undefined) & {
  cancel: () => void;
  flush: () => TResult | undefined;
};

export default function throttle<TArgs extends Array<any>, TResult>(
  func: ThrottleCallback<TArgs, TResult>,
  wait: number,
  options: ThrottleOptions = {},
): ThrottledFunction<TArgs, TResult> {
  throw new Error("Not implemented!");
}
