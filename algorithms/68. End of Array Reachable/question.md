# End of Array Reachable

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Arrays, Dynamic programming, Greedy

> Source: [array-reachable-end](https://www.greatfrontend.com/questions/algo/array-reachable-end)

Given an array of integers `numbers` where each element in the array represents the **maximum** number of positions that can be moved forward from that index; it is acceptable to move by fewer positions.

Determine whether it is possible to reach the last index of the array by starting from the first index. Return `true` if it can be reached and `false` otherwise.

### Input

- `numbers: number[]`: An array of integers, each index's value is the maximum number of positions reachable from that index

| Input                     | Output  | Explanation                                                                                                                                                                                              |
| ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `numbers = [4,1,0,0,2,3]` | `true`  | Move from index 0 to 4, then move 1 position to the last index.                                                                                                                                          |
| `numbers = [1,0,0,0]`     | `false` | Can only move from index 0 to index 1 and no further movements thereafter, so it impossible to reach the last index.                                                                                     |
| `numbers = [2,3,1,1,4]`   | `true`  | Move 1 position forward from index 0 to index 1 (it is allowed to move up to 2 positions, but going to index 1 first allows us to move further). From index 1, move 3 positions to reach the last index. |

### Constraints

- 1 <= `numbers.length` <= 10,000
- 0 <= `numbers[i]` <= 100,000

## Hints

### What future information can one position summarize?

You do not need to remember every jump sequence. It is enough to know whether some position already known to reach the end is within range.

### Can the destination move toward the start?

Working backward, any index that can jump to a known-good position is itself a place from which the end is reachable.

## Starter code

**TypeScript**

```ts
export default function arrayReachableEnd(numbers: number[]): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {boolean}
 */
export default function arrayReachableEnd(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Bottom-Up Dynamic Programming

A naive solution would involve recursively exploring all possible paths from the first position to check if the last position can be reached. This approach suffers from redundant computations and an exponential time complexity, as it explores overlapping subproblems multiple times.

The bottom-up dynamic programming approach optimizes this by iterating from the second-last position to the first position while maintaining a `memo` array that records whether each position is `GOOD`, `BAD`, or `UNKNOWN`. A position is `GOOD` if it can reach the last position or a position already marked as `GOOD`. The optimization eliminates redundant checks by using previously computed results in the `memo` array.

#### Algorithm

1. Define an enumeration `Index` with states `GOOD`, `BAD`, and `UNKNOWN` to represent the state of each index.
2. Initialize a `memo` array of the same length as the input array with all values set to `Index.UNKNOWN`.
3. Set the last position in `memo` to `Index.GOOD` since the last position can trivially reach itself.
4. Iterate backward through the input array from the second-last position to the first position:

- Calculate the furthest position reachable from the current index using the minimum of `i + numbers[i]` and the last index.
- Check all positions between the current index and the furthest reachable position:
  - If any of these positions is marked as `Index.GOOD` in `memo`, mark the current position as `Index.GOOD` and break the inner loop.

5. Return `true` if the first position is marked as `Index.GOOD` in `memo`, indicating the last position is reachable. Otherwise, return `false`.

```ts
// Enum to represent the state of each index in the array
enum Index {
  GOOD, // Represents a position from which you can reach the last position
  BAD, // Represents a position from which you cannot reach the last position
  UNKNOWN, // Represents an unknown state
}

/**
 * Determines if you can reach the last element in an array, where each element represents
 * the maximum positions you can reach from that index.
 *
 * @param {number[]} numbers - An array of numbers representing maximum positions reachable from that index.
 * @returns {boolean} - True if you can reach the last index, false otherwise.
 */
export default function arrayReachableEnd(numbers: number[]): boolean {
  // Initialize the memoization array with "UNKNOWN"
  let memo: Index[] = Array(numbers.length).fill(Index.UNKNOWN);

  // The last position is always "GOOD" because we are already there
  memo[memo.length - 1] = Index.GOOD;

  // Iterate from the second last position to the first position
  for (let i = numbers.length - 2; i >= 0; i--) {
    // Calculate the furthest position that can be reached from the current position
    let furthestPosition: number = Math.min(i + numbers[i], numbers.length - 1);

    // Check if any reachable position from the current position is "GOOD"
    for (let j = i + 1; j <= furthestPosition; j++) {
      if (memo[j] === Index.GOOD) {
        // Mark the current position as "GOOD" if a reachable position is "GOOD"
        memo[i] = Index.GOOD;
        break;
      }
    }
  }

  // Return true if the first position is "GOOD", meaning you can reach the last element
  return memo[0] === Index.GOOD;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. For each position, the inner loop checks up to `numbers[i]` positions, leading to a worst-case quadratic complexity.
- **Space complexity: O(n)**. The `memo` array of size `n` is used for dynamic programming storage.

### 2. Top-Down Dynamic Programming

There is another top-down dynamic programming approach, where the process begins from the first position and uses recursion to determine whether subsequent reachable positions can lead to the last position. The memoization array ensures that previously computed results are reused, avoiding redundant calculations and improving efficiency.

#### Algorithm

1. Initialize a `memo` array of the same length as the input array with all values set to `'UNKNOWN'`.
2. Set the last position in the `memo` array to `'GOOD'` because it can trivially reach itself.
3. Define a helper function `canReachLastPosition` that takes the current position and the input array as arguments:

- If the current position is already marked in `memo`, return the corresponding result.
- If the value at the current position is `0`, mark it as `'BAD'` and return `false` because it cannot proceed further.
- Calculate the furthest position reachable from the current position as the minimum of `position + numbers[position]` and the last index.
- Iterate backward through all reachable positions from the current position:
  - If any reachable position is `'GOOD'`, mark the current position as `'GOOD'` and return `true`.
- If none of the reachable positions are `'GOOD'`, mark the current position as `'BAD'` and return `false`.

4. Start the recursion from the first position using the helper function.
5. Return `true` if the first position is `'GOOD'`, indicating the last position is reachable. Otherwise, return `false`.

```ts
// Memoization array to store the state of each position
let memo: string[];

/**
 * Helper function to determine if you can reach to the last position from the current position.
 *
 * @param {number} position - The current position in the array.
 * @param {number[]} numbers - An array of numbers representing maximum movement lengths at each index.
 * @returns {boolean} - True if you can reach the last element from the current position, false otherwise.
 */
const canReachLastPosition = (position: number, numbers: number[]): boolean => {
  // Check the memoization array to see if the result is already computed
  if (memo[position] !== "UNKNOWN") {
    return memo[position] === "GOOD";
  }

  // If current position is a stuck position, directly return false
  if (numbers[position] === 0) {
    memo[position] = "BAD";
    return false;
  }

  // Calculate the furthest position that can be reached from the current position
  const furthestPosition = Math.min(
    position + numbers[position],
    numbers.length - 1,
  );

  // Iterate through all positions that can be reached from the current position
  // Iterate backward for better efficiency (reduce redundant calls)
  for (
    let nextPosition = furthestPosition;
    nextPosition > position;
    nextPosition--
  ) {
    if (canReachLastPosition(nextPosition, numbers)) {
      memo[position] = "GOOD";
      return true;
    }
  }

  // If none of the next positions can reach the last position, mark the current position as "BAD"
  memo[position] = "BAD";
  return false;
};

/**
 * Determines if you can reach the last element in an array, where each element represents
 * the maximum positions you can reach from that index.
 *
 * @param {number[]} numbers - An array of numbers representing maximum positions reachable from that index.
 * @returns {boolean} - True if you can reach the last index, false otherwise.
 */
export default function arrayReachableEnd(numbers: number[]): boolean {
  // Initialize the memoization array with "UNKNOWN"
  memo = new Array(numbers.length).fill("UNKNOWN");

  // The last position is always "GOOD" because we are already there
  memo[memo.length - 1] = "GOOD";

  // Start the recursion from the first position
  return canReachLastPosition(0, numbers);
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The worst-case scenario involves checking all reachable positions for each index, resulting in quadratic complexity.
- **Space complexity: O(n)**. The `memo` array of size `n` is used for storing intermediate results, and the recursion stack may go up to `n` calls.

### 3. Greedy Approach

In the greedy approach, the algorithm starts from the last position and iterates backward. For each position, it checks if the current position can reach the farthest reachable position. If it can, the farthest reachable position is updated to the current position. If, after processing the entire array, the farthest reachable position becomes the first index, it means the last position is reachable.

#### Algorithm

1. Initialize a variable `farthestReachable` to the last index of the array (`numbers.length - 1`).
2. Iterate backward through the array starting from the last index:

- For each position, check if `currentPosition + numbers[currentPosition]` is greater than or equal to `farthestReachable`.
- If true, update `farthestReachable` to `currentPosition`.

3. After the iteration, check if `farthestReachable` equals `0`:

- Return `true` if `farthestReachable` is `0`, indicating the last position is reachable from the first position.
- Otherwise, return `false`.

```ts
export default function arrayReachableEnd(numbers: number[]): boolean {
  // Initialize a variable to track the farthest reachable position (last element initially)
  let farthestReachable = numbers.length - 1;

  // Iterate backwards through the array (from the end)
  for (
    let currentPosition = numbers.length - 1;
    currentPosition >= 0;
    currentPosition--
  ) {
    // Check if the current position can reach the farthest reachable position
    if (currentPosition + numbers[currentPosition] >= farthestReachable) {
      // Update the farthest reachable position if the current position can reach it
      farthestReachable = currentPosition;
    }
  }

  // Return true if the farthest reachable position is the
  // first element (meaning you can reach the end)
  return farthestReachable === 0;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm iterates through the array once in reverse order.
- **Space complexity: O(1)**. No additional space is used other than a constant number of variables.

## Exercises

### Check your understanding 1

In a backward scan, `goal` is the leftmost index examined so far that can reach the last index. Explain why an earlier index `i` only needs to check whether `i + numbers[i] >= goal`, rather than trying every later reachable position.

**Answer**

If `i` can reach `goal`, it can follow the path already known to reach the end. If its maximum reach is before `goal`, it cannot reach any good index in the examined suffix, because `goal` is the leftmost one. Updating `goal` to `i` therefore preserves the invariant. This relies on each number being a maximum jump, so landing at `goal` is allowed even when a longer jump is possible.

**Checklist**

- Explains why reaching the current goal suffices.
- Explains why falling short rules out every examined good index.
- Uses the maximum-jump assumption.

### Check your understanding 2

A forward scan tracks the farthest reachable index. A faulty version updates that limit from every array entry, including entries beyond the current limit. Which input demonstrates the problem?

- [ ] `[2, 0, 1]`
  > Index `0` can already reach the destination, so the zero is harmless.
- [x] `[0, 2, 0]`
  > Index `1` is unreachable. Using its jump length invents a path from index `0` to the end.
- [ ] `[1, 2, 0]`
  > Index `1` can be reached from index `0`, so using its jump length is valid.
