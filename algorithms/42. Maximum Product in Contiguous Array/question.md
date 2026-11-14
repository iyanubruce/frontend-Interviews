# Maximum Product in Contiguous Array

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Arrays

> Source: [array-maximum-product-contiguous](https://www.greatfrontend.com/questions/algo/array-maximum-product-contiguous)

Given an array of integers `numbers`, determine the subarray that has the highest product and return that product.

A **subarray** is a contiguous segment of an array where all elements are taken from consecutive indices, preserving their order, such as `[2, 3]` in `[1, 2, 3, 4]`, while non-contiguous selections like `[1, 3]` are not valid subarray.

### Input

- `numbers: number[]`: An array of integers

### Notes

- The test cases are designed such that the result will fit within a 32-bit integer
- The product of any prefix or suffix of `numbers` is guaranteed to fit in a 32-bit integer

| Input                       | Output | Explanation                                                    |
| --------------------------- | ------ | -------------------------------------------------------------- |
| `numbers = [1,2,-3,5,1]`    | `5`    | The subarray [5, 1] has the largest product i.e 5.             |
| `numbers = [9]`             | `9`    | The single-element subarray [9] has the largest product i.e 9. |
| `numbers = [1,2,0,-1,8,-4]` | `32`   | The subarray [-1, 8, -4] has the largest product i.e 32.       |

### Constraints

- 1 <= `numbers.length` <= 1,000
- -10 <= `numbers[i]` <= 10

## Hints

### Which product can become useful after a sign change?

In `[-2, 3, -4]`, the product that looks worse after `3` becomes the winner after multiplying by `-4`.

### What does zero split apart?

No non-zero product can cross a zero, but zero can still be the largest product in the array.

## Starter code

**TypeScript**

```ts
export default function maxProductSubArray(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function maxProductSubArray(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach

The naive approach is to consider all possible contiguous subarrays to determine the maximum product. The process involves picking a starting index `i` and then iterating through all possible ending indices `j` for that subarray. For each subarray, the cumulative product is calculated and compared against the current maximum stored in `result`. Since every subarray is examined, the approach guarantees finding the maximum product.

#### Algorithm

1. Check if the input array `numbers` is empty and return `0` if it is.
2. Initialize `result` as the first element of `numbers`.
3. Iterate through each element in `numbers` using an index `i`.
4. Initialize an accumulator `accu` to `1` for the current subarray product.
5. For each `i`, iterate through elements from `i` to the end of `numbers` using an index `j`.
6. Update `accu` by multiplying it with `numbers[j]`.
7. Compare `accu` with `result` and update `result` if `accu` is greater.
8. After considering all subarrays, return `result`.

```ts
export default function maxProductSubArray(numbers: number[]): number {
  // Edge case: if the array is empty, return 0
  if (numbers.length === 0) return 0;

  // Initialize the result with the first element
  let result = numbers[0];

  // Iterate through each element as the starting point
  for (let i = 0; i < numbers.length; i++) {
    // Initialize accumulator for the product of subarrays
    let accu = 1;

    // Iterate through subarrays starting from index i
    for (let j = i; j < numbers.length; j++) {
      // Multiply the current element
      accu *= numbers[j];

      // Update the result if the current product is larger
      result = Math.max(result, accu);
    }
  }

  // Return the maximum product found
  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. Each subarray is considered, leading to a nested iteration through the array.
- **Space complexity: O(1)**. Only a few variables `result` and `accu` are used, requiring constant additional space.

### 2. Using Dynamic Programming

A brute force approach calculates the product of every possible subarray. There are O(n2) subarrays, each defined by a start and an end position.

This solution uses a dynamic programming approach to solve the problem in O(n) time. The approach tracks at each position the maximum and minimum subarray product ending at that position. Negative numbers affect the product sign and can flip a minimum product into a maximum one. By maintaining running values of the maximum and minimum products so far, the computation avoids recalculating products for all subarrays.

#### Algorithm

1. Check if `numbers` is empty and return `0` if true.
2. Initialize `maxSoFar`, `minSoFar`, and `result` to the first element of `numbers`.
3. Iterate from the second element of `numbers` to the end.
4. For each element `curr`, compute a temporary maximum product as the maximum of `curr`, `maxSoFar * curr`, and `minSoFar * curr`.
5. Update `minSoFar` as the minimum of `curr`, `maxSoFar * curr`, and `minSoFar * curr`.
6. Update `maxSoFar` with the temporary maximum.
7. Update `result` if `maxSoFar` is greater than `result`.
8. Return `result`.

```ts
export default function maxProductSubArray(numbers: number[]): number {
  // Edge case: if the array is empty, return 0
  if (numbers.length === 0) return 0;

  // Initialize variables to track the maximum and minimum products so far
  let maxSoFar: number = numbers[0];
  let minSoFar: number = numbers[0];
  let result: number = maxSoFar;

  // Iterate through the array starting from the second element
  for (let i = 1; i < numbers.length; i++) {
    let curr: number = numbers[i];

    // Calculate the temporary maximum product
    let tempMax: number = Math.max(curr, maxSoFar * curr, minSoFar * curr);

    // Update the minimum product
    minSoFar = Math.min(curr, maxSoFar * curr, minSoFar * curr);

    // Update the maximum product with the temporary value
    maxSoFar = tempMax;

    // Update the result with the maximum product found so far
    result = Math.max(maxSoFar, result);
  }

  // Return the maximum product of any subarray
  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each element is processed once.
- **Space complexity: O(1)**. There is no additional data structures being used, so constant space is used.

### 3. Using Prefix and Suffix Product

Another optimized approach uses prefix and suffix products to track the running products from both ends. By doing so, it becomes easier to handle zeros and negative values. When a zero is encountered, the running product can be reset instead of recalculating all subarrays again. This approach avoids redundant work and achieves a linear runtime.

#### Algorithm

1. Initialize three variables: `pre` for prefix product, `suff` for suffix product, and `maxProduct` for tracking the maximum product found.
2. Iterate through the array using an index `i` from 0 to `n-1`.
3. Update `pre` by checking if `pre` is zero, then set `pre` to the current element, otherwise multiply `pre` by the current element.
4. Similarly, update `suff` by checking if `suff` is zero, then set `suff` to the element from the end at index `n - i - 1`, otherwise multiply `suff` by that element.
5. Update `maxProduct` by comparing it against both `pre` and `suff` and store the maximum value found.
6. Return `maxProduct` after completing the iteration.

```ts
export default function maxProductSubArray(numbers: number[]): number {
  // Get the size of the input array
  const n = numbers.length;

  // Initialize variables to store prefix product, suffix product, and maximum product
  let pre = 1; // Stores the product of all elements up to the current element (inclusive)
  let suff = 1; // Stores the product of all elements from the end up to the current element (inclusive)
  let maxProduct = Number.NEGATIVE_INFINITY; // Tracks the maximum product of any subarray found so far

  // Iterate through the array
  for (let i = 0; i < n; i++) {
    // Handle the case where the previous product was 0 (requires reset to 1)
    pre = pre === 0 ? numbers[i] : pre * numbers[i];

    // Handle the case where the previous product was 0 (requires reset to 1)
    suff = suff === 0 ? numbers[n - i - 1] : suff * numbers[n - i - 1];

    // Update the maximum product considering both prefix and suffix products
    maxProduct = Math.max(maxProduct, Math.max(pre, suff));
  }

  // Return the maximum product of any subarray found
  return maxProduct;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each element is processed once.
- **Space complexity: O(1)**. Only a constant amount of extra space is required.

## Exercises

### Check your understanding 1

A maximum-product implementation removes every zero before applying its usual recurrence. Which input exposes why that preprocessing is invalid?

- [ ] `[2, 3, 0]`
  > Removing the trailing zero leaves the same best product, `6`, so this test does not expose the bug.
- [x] `[-2, 0, -3]`
  > Removing zero joins two separated segments and invents product `6`; the actual maximum is `0`.
- [ ] `[0, 2, 3]`
  > The positive suffix already has product `6`, so both implementations return the same answer.

### Check your understanding 2

Immediately before processing `-2`, the maximum product ending at the previous position is `4` and the minimum is `-12`. Considering a fresh start as well, what is the new maximum product ending at `-2`?

- [ ] `-2`
  > Starting a new subarray produces `-2`, but multiplying the prior minimum produces a larger candidate.
- [ ] `-8`
  > Extending the prior maximum gives `4 × -2 = -8`, which is not the largest of the three candidates.
- [ ] `8`
  > Taking an absolute value is not part of the recurrence because it can represent a product no contiguous subarray actually produces.
- [x] `24`
  > Extending the prior minimum gives `-12 × -2 = 24`, and the negative multiplier turns that minimum into the largest candidate.
