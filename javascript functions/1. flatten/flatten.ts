type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  const newArray = [];
  for (const x of value) {
    if (Array.isArray(x)) {
      const flattenChild = flatten(x);
      for (let i = 0; i < flattenChild.length; i++) {
        newArray.push(flattenChild[i]);
      }
    } else {
      newArray.push(x);
    }
  }
  return newArray;
}
