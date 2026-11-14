type AnyFunction = (this: any, ...args: any[]) => any;

export default function debounce(func: AnyFunction, wait: number): Function {
  let timeOutId: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => func.apply(this, args), wait);
  };
}
