# Array Product Excluding Current

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Arrays

> Source: [array-product-excluding-current](https://www.greatfrontend.com/questions/algo/array-product-excluding-current)

Given an array of integers `numbers`, return a new array `result` where each element `result[i]` represents the product of all the elements in `numbers` except for `numbers[i]`.

### Input

- `numbers: number[]`: An array of integers

### Notes

- The product of any prefix or suffix of the `numbers` array is ensured to fit within a 32-bit integer
- Use of the division operator is prohibited

| Input                  | Output      | Explanation                                                                                   |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `numbers = [1,2,3]`    | `[6,3,2]`   | Output is multiplication of all other elements except self, i.e 2*3, 1*3, 1*2                 |
| `numbers = [2,0,3]`    | `[0,6,0]`   | Output is multiplication of all other elements except self, i.e 0*3, 2*3, 2*0                 |
| `numbers = [0,0,-1,1]` | `[0,0,0,0]` | Output is multiplication of all other elements except self, i.e 0*-1*1, 0*-1*1, 0*0*1, 0*0*-1 |

### Constraints

- 2 <= `numbers.length` <= 1,000
- -10 <= `numbers[i]` <= 10

## Hints

### What lies on either side of an excluded index?

For position `i`, every factor comes from the prefix before `i` or the suffix after it.

### Which products repeat between neighboring outputs?

The product to the left of one index extends the product for its neighbor; the same relationship appears from the right. Reuse those partial products instead of multiplying the same ranges again.

## Starter code

**TypeScript**

```ts
export default function arrayProductExcludingCurrent(
  numbers: number[],
): number[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number[]}
 */
export default function arrayProductExcludingCurrent(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Prefix and Suffix

The task is to compute an array where each element at index `i` is the product of all elements in the input array except the one at `i`. This solution uses separate prefix and suffix arrays to store intermediate calculations, enabling an efficient computation of the result.

A brute force approach would involve iterating through the array and calculating the product of all elements except the current one for each index. This results in a time complexity of O(n2) due to repeated multiplication for each index. The optimized prefix-suffix approach eliminates this redundancy by precomputing the products to the left and right of each element.

The prefix array stores the cumulative product of elements from the start up to the index `i - 1`, and the suffix array stores the cumulative product of elements from the end down to the index `i + 1`. These arrays are combined to compute the final result array, with each element being the product of the corresponding prefix and suffix values. The handling of negative zero ensures consistent output formatting.

#### Algorithm

1. Create three arrays: `prefix`, `suffix`, and `result`, each of size `n` and initialized with `1`.
2. Calculate the prefix array:

- Set `prefix[0] = 1` because there are no elements to the left of the first element.
- Iterate from index `1` to `n - 1`, setting `prefix[i]` as `prefix[i - 1] * numbers[i - 1]`.

3. Calculate the suffix array:

- Set `suffix[n - 1] = 1` because there are no elements to the right of the last element.
- Iterate from index `n - 2` to `0`, setting `suffix[i]` as `suffix[i + 1] * numbers[i + 1]`.

4. Calculate the result array:

- Iterate through the array and set `result[i]` as `prefix[i] * suffix[i]`.

5. Handle special cases:

- Iterate through the `result` array and replace any occurrences of `-0` with `0` for consistent output.

6. Return the `result` array.

```ts
export default function arrayProductExcludingCurrent(
  numbers: number[],
): number[] {
  const n = numbers.length;

  // Create prefix and suffix arrays
  const prefix: number[] = new Array(n).fill(1);
  const suffix: number[] = new Array(n).fill(1);
  const result: number[] = new Array(n).fill(1);

  // Step 1: Fill prefix array
  prefix[0] = 1; // First element has no elements to its left
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * numbers[i - 1];
  }

  // Step 2: Fill suffix array
  suffix[n - 1] = 1; // Last element has no elements to its right
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * numbers[i + 1];
  }

  // Step 3: Calculate result array by combining prefix and suffix
  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i];
  }

  // Step 4: Convert -0 to 0 if needed
  for (let i = 0; i < n; i++) {
    if (result[i] === -0) {
      result[i] = 0;
    }
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm involves three linear passes: one to compute the prefix array, one to compute the suffix array, and one to compute the result array.
- **Space complexity: O(n)**. Two auxiliary arrays (`prefix` and `suffix`) of size `n` are used in addition to the `result` array.

### 2. Space Optimized Version of Above Approach

This solution improves the space usage further by calculating the product of all elements to the left of each index during the first pass and storing these values in the `result` array. During the second pass, it calculates the product of all elements to the right of each index and multiplies these values with the corresponding values already stored in the `result` array.

#### Algorithm

1. Initialize a `result` array of the same length as the input array with all elements set to `1`.
2. Calculate the left products:

- Iterate through the array from left to right starting at index `1`.
- For each index `i`, compute the product of all elements to the left by multiplying `numbers[i - 1]` with `result[i - 1]`.
- Store the result in `result[i]`.

3. Calculate the right products and combine with the left products:

- Initialize a variable `rightProduct` to `1`.
- Iterate through the array from right to left.
- For each index `i`, multiply the value in `result[i]` with `rightProduct` to include the product of all elements to the right.
- Update `rightProduct` by multiplying it with `numbers[i]`.

4. Handle special cases:

- Replace any occurrences of `-0` in `result` with `0` for consistent output.

5. Return the `result` array.

```ts
export default function arrayProductExcludingCurrent(
  numbers: number[],
): number[] {
  // Get the length of the input array
  const length = numbers.length;

  // Initialize the result array
  const result: number[] = new Array(length).fill(1);

  // Calculate products of all elements to the left of each index
  for (let i = 1; i < length; i++) {
    // result[i] contains the product of all elements to the left of index 'i'
    result[i] = numbers[i - 1] * result[i - 1];
  }

  // Variable to hold the product of all elements to the right
  let rightProduct = 1;
  for (let i = length - 1; i >= 0; i--) {
    // Multiply the right product with the current result
    result[i] *= rightProduct;
    // Update rightProduct with the current element
    rightProduct *= numbers[i];
  }

  // Convert -0 or +0 to normal 0
  for (let i = 0; i < length; i++) {
    if (result[i] === -0) {
      result[i] = 0;
    }
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm involves two linear passes over the array for calculating left and right products and one additional pass for normalization.
- **Space complexity: O(1)**. The solution uses constant extra space, as calculations are performed directly in the `result` array.

## Exercises

### Check your understanding 1

A two-pass solution first stores the product strictly left of each index in `result`. In its right-to-left pass, a refactor executes `rightProduct *= numbers[i]` before `result[i] *= rightProduct`. What is the error?

- [ ] It omits the value immediately to the left of each index.
  > The left products were already stored correctly before this pass.
- [ ] It omits the rightmost input value from every output.
  > The update actually includes each current value too early.
- [x] It includes the current input value in the output that should exclude it.
  > Before multiplying into `result[i]`, `rightProduct` must contain only indices greater than `i`. Updating it first violates that invariant.

### Check your understanding 2

Compare inputs with exactly one zero and with at least two zeros. Why can the same prefix/suffix multiplication handle both without dividing or adding special zero branches?

**Answer**

With one zero, only the output at that zero’s index excludes it; that output is the product of all other values. Every other output includes the zero. With two or more zeros, excluding any one position still leaves a zero, so all outputs are zero. Prefix and suffix products multiply exactly the remaining positions, so these outcomes follow without dividing by the current value.

**Checklist**

- Distinguishes the zero position from other positions when there is one zero.
- Explains why two zeros force every output to zero.
- Connects both cases to the factors included in prefix/suffix products.
