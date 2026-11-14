# Triplet Sum

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Arrays

> Source: [triplet-sum](https://www.greatfrontend.com/questions/algo/triplet-sum)

Given an integer array `numbers`, return all triplets `[numbers[i], numbers[j], numbers[k]]` such that `i`, `j`, and `k` are distinct indices and their values sum to 0. Ensure that the solution set contains no duplicate triplets.

### Input

- `numbers: number[]`: An array of integers

### Notes

- Sort the values within each triplet in ascending order, then sort the list of triplets lexicographically

| Input                        | Output                 | Explanation                                                                                                                                                                                                                    |
| ---------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `numbers = [-1,0,1,2,-1,-4]` | `[[-1,-1,2],[-1,0,1]]` | numbers[0] + numbers[1] + numbers[2] = (-1) + 0 + 1 = 0. numbers[1] + numbers[2] + numbers[4] = 0 + 1 + (-1) = 0. numbers[0] + numbers[3] + numbers[4] = (-1) + 2 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2] |
| `numbers = [0,0,0]`          | `[[0,0,0]]`            | The only possible triplet adds up to 0                                                                                                                                                                                         |
| `numbers = [1,0,0]`          | `[]`                   | The only possible triplet does not add up to 0                                                                                                                                                                                 |

### Constraints

- 3 <= `numbers.length` <= 1,000
- -10,000 <= `numbers[i]` <= 10,000

## Hints

### Can one value reduce this to Pair Sum?

After fixing one value in sorted order, what sum must the remaining pair have?

### Which side should move?

Start the remaining pair at opposite ends of the sorted suffix. If the three-value sum is too small or too large, decide which movement is guaranteed to take it in the useful direction.

### Where can duplicate triplets arise?

Trace an input containing repeated values, such as `[-1, -1, 0, 1, 1]`. Which equal values must be passed over after fixing a first value or finding a result so the same triplet is not emitted again?

## Starter code

**TypeScript**

```ts
export default function tripletSum(numbers: number[]): number[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
export default function tripletSum(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute force

The goal is to find all unique triplets in an array that sum up to zero. The approach is to use three nested loops to explore every combination of three numbers. Each combination is checked to see if it sums to zero. A `Set` is used to store the unique triplets by converting them into strings, ensuring that duplicates are avoided. Sorting the triplets helps maintain order and ensures that duplicates are detected correctly when added to the `Set`.

#### Algorithm

1. Initialize a `Set` to store unique triplets.
2. Iterate through the array with three nested loops:
3. The outermost loop fixes the first number of the triplet.
4. The second loop fixes the second number of the triplet.
5. The innermost loop selects the third number of the triplet.
6. For each combination of three numbers, check if their sum is equal to zero.
7. If the sum is zero, sort the triplet to maintain order and convert it into a string to store in the `Set`.
8. After completing the iterations, convert the `Set` back to an array of arrays by parsing the stored strings.
9. Sort the resulting array of triplets to meet the requirements for ordered results.
10. Return the sorted array of triplets.

```ts
export default function tripletSum(numbers: number[]): number[][] {
  // Set to store unique triplets
  const uniqueTriplets = new Set<string>();
  const n = numbers.length;

  // Iterate through the array to find triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        // Check if the sum of three numbers is zero
        if (numbers[i] + numbers[j] + numbers[k] === 0) {
          // Sort the triplet to maintain order
          const triplet = [numbers[i], numbers[j], numbers[k]].sort(
            (a, b) => a - b,
          );
          // Convert to string for set storage
          uniqueTriplets.add(JSON.stringify(triplet));
        }
      }
    }
  }
  // result should be in sorted order as mentioned in the description.
  const result: number[][] = Array.from(uniqueTriplets)
    .map((triplet) => JSON.parse(triplet))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n3)**. The three nested loops iterate through all possible combinations of three numbers in the array.
- **Space complexity: O(k)**. The `Set` used for storing unique triplets and the resulting array require space proportional to the number of unique triplets, which is `k`.

### 2. Two pointers

Sort the array. For each fixed first element (`i`), scan the remaining suffix with two pointers (`j` and `k`). Advance `j` when the sum is negative and decrease `k` when it is positive. Skip duplicate values to avoid returning duplicate triplets. This replaces the third nested loop with a two-pointer scan.

#### Algorithm

1. Sort the input array in ascending order to allow efficient two-pointer traversal.
2. Initialize an empty array `ans` to store the triplets.
3. Iterate through the sorted array with index `i`:
4. Skip duplicate elements to ensure that each starting element is unique.
5. Set two pointers: `j` at the index after `i`, and `k` at the last index of the array.
6. While `j` is less than `k`:
7. Compute the sum of `numbers[i]`, `numbers[j]`, and `numbers[k]`.
8. If the sum equals zero: - Add the triplet `[numbers[i], numbers[j], numbers[k]]` to `ans`. - Move `j` forward and `k` backward, skipping duplicate elements.
9. If the sum is less than zero, increment `j` to increase the sum.
10. If the sum is greater than zero, decrement `k` to decrease the sum.
11. Return the `ans` array containing all unique triplets.

```ts
export default function tripletSum(numbers: number[]): number[][] {
  const ans: number[][] = [];

  // Sort the input array for efficient two-pointer search
  numbers.sort((a, b) => a - b);

  for (let i = 0; i < numbers.length - 2; i++) {
    // Skip duplicates: only consider unique starting elements (i)
    if (i > 0 && numbers[i] === numbers[i - 1]) continue;

    // Two-pointer approach for remaining elements (j & k)
    let j = i + 1;
    let k = numbers.length - 1;

    while (j < k) {
      const sum = numbers[i] + numbers[j] + numbers[k];

      if (sum === 0) {
        // Found a triplet, add it to the answer
        ans.push([numbers[i], numbers[j], numbers[k]]);

        // Move pointers to skip duplicates
        do {
          j++;
        } while (j < k && numbers[j] === numbers[j - 1]);
        do {
          k--;
        } while (j < k && numbers[k] === numbers[k + 1]);
      } else if (sum < 0) {
        // Move j forward to search for a larger positive number
        j++;
      } else {
        // Move k backward to search for a smaller negative number
        k--;
      }
    }
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. Sorting the array takes O(n log n), and the two-pointer traversal for each element takes O(n), resulting in O(n2).
- **Space complexity: O(1)**. The solution uses a constant amount of extra space apart from the output array.

## Exercises

### Check your understanding 1

For a fixed value in a sorted array, the current left and right values make the sum positive. Prove that discarding the current right value cannot lose a zero-sum pair still inside the search interval. Why is “it makes the sum smaller” alone an incomplete justification?

**Answer**

For this fixed value and current right value, every other available left position is at least as large as the current left value. Every pair retaining right therefore has a sum at least as large as the current positive sum, so none can be zero. Decrementing right eliminates only impossible pairs. Merely observing that one move lowers the sum does not show that the discarded candidates contain no solution; the sorted-order inequality supplies that proof.

**Checklist**

- Quantify over all remaining left positions paired with the current right.
- Use sorted order to show every such sum remains positive.
- Distinguish a promising move from a safe elimination.

### Check your understanding 2

A candidate deduplicates the entire input with a set before searching for triplets. Which inputs lose a valid result? Select all that apply.

- [x] `[0, 0, 0]`
  > The result [0, 0, 0] uses three distinct indices. A set leaves only one zero, making that valid result impossible.
- [ ] `[-1, 0, 1]`
  > All three values are already distinct, so deduplicating changes nothing.
- [x] `[-2, -2, 4]`
  > The two -2 occurrences are different input positions required for [-2, -2, 4]. A set loses one.
- [ ] `[1, 1, 2]`
  > No triplet sums to zero before or after deduplication, so there is no valid result to lose.
