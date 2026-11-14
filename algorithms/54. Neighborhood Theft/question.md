# Neighborhood Theft

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Arrays, Dynamic programming

> Source: [neighborhood-theft](https://www.greatfrontend.com/questions/algo/neighborhood-theft)

An experienced robber aims to steal the money in the houses on a street. Each house has a certain amount of money hidden, but there is a catch: the security systems in adjacent houses are interconnected. If the robber breaks into two neighboring houses, the police will be alerted.

Given an array of integers `numbers` where each element represents the amount of money in a house, determine the maximum amount of money the robber can steal without triggering the alarm.

### Input

- `numbers: number[]`: An array of integers

### Notes

- The robber cannot steal from two adjacent houses

| Input                         | Output | Explanation                                                                                                                             |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `numbers = [1,2,3,1]`         | `4`    | The robber can steal a maximum of 4 by robbing house at index 0 (value 1) and house at index 2 (value 3).                               |
| `numbers = [2,7,9,3,1]`       | `12`   | The robber can steal a maximum of 12 by robbing house at index 0 (value 2), house at index 2 (value 9), and house at index 4 (value 1). |
| `numbers = [3,6,1,0,6,0,0,9]` | `21`   | The robber can steal a maximum of 21 by robbing house at index 1 (value 6), house at index 4 (value 6), house at index 7 (value 9).     |

### Constraints

- 1 <= `numbers.length` <= 100
- 0 <= `numbers[i]` <= 400

## Hints

### What two totals compete at each house?

Compare the best total that skips the current house with the current value plus the best total beyond its neighbor.

### Why should each position be solved only once?

Different choices can lead to the same remaining suffix. Store its best total, or compute the suffixes in an order that reuses earlier results.

## Starter code

**TypeScript**

```ts
export default function neighborhoodTheft(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function neighborhoodTheft(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Top-Down Dynamic Programming

This solution uses a top-down dynamic programming approach with memoization to solve the "neighborhood theft" problem. The problem involves maximizing the amount of money stolen from houses while ensuring that no two adjacent houses are robbed.

The algorithm starts from the first house and recursively explores two options:

1. Skip the current house and move to the next one.
2. Rob the current house and move to the house after the next one.

Cache the best result for each starting house so that each subproblem is computed only once.

#### Algorithm

1. Initialize a `memo` array with the size of the input array, filled with `-1`, to indicate uncomputed values.
2. Define a helper function `robFrom` that recursively computes the maximum money that can be robbed starting from the `i`th house.
3. Check the base case where `i` exceeds the bounds of the array, returning `0` since no houses are left to rob.
4. If the result for house `i` is already computed and stored in `memo[i]`, return the cached value.
5. Compute the maximum value between: - Skipping the current house by calling `robFrom(i + 1, numbers)`. - Robbing the current house and adding its value to the result of `robFrom(i + 2, numbers)`.
6. Store the computed result in `memo[i]` for future use.
7. Start the computation by calling `robFrom(0, numbers)` to process all houses.
8. Return the result of the computation, which represents the maximum money that can be robbed without triggering the alarm.

```ts
// Memoization array to store the results of subproblems
let memo: number[] = [];

// Main function to calculate the maximum amount of money that can be robbed
export default function neighborhoodTheft(numbers: number[]): number {
  // Initialize the memo array with -1 to indicate uncomputed values
  memo = new Array(numbers.length).fill(-1);

  // Start the recursive function from the first house
  return robFrom(0, numbers);
}

// Helper function to calculate the maximum amount of money that can be robbed from the ith house onwards
function robFrom(i: number, numbers: number[]): number {
  // Base case: No more houses left to examine
  if (i >= numbers.length) {
    return 0;
  }

  // If the result for this subproblem is already computed, return the cached value
  if (memo[i] > -1) {
    return memo[i];
  }

  // Calculate the maximum amount by either:
  // 1. Skipping the current house and moving to the next one
  // 2. Robbing the current house and moving to the house after the next one
  const ans = Math.max(
    robFrom(i + 1, numbers),
    robFrom(i + 2, numbers) + numbers[i],
  );

  // Cache the result for future use
  memo[i] = ans;

  // Return the computed result
  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each house is processed at most once, and the result is stored in the `memo` array, avoiding redundant recursive calls.
- **Space complexity: O(n)**. The `memo` array requires space proportional to the number of houses, and the recursion stack may go up to a depth of `n` in the worst case.

### 2. Bottom-Up Dynamic Programming

This approach eliminates recursion by iteratively building a `dp` table (or array) from the last house to the first house, ensuring all subproblems are solved sequentially.

The `dp` array, `maxRobbedAmount`, stores the maximum money that can be robbed considering houses from the current index up to the last house. For each house, two options are considered:

1. Skip the current house and take the result stored for the next house (`maxRobbedAmount[i + 1]`).
2. Rob the current house and add its value to the result stored for skipping the next house (`maxRobbedAmount[i + 2] + numbers[i]`).

The decision for each house is made by choosing the option that provides the maximum amount. This avoids redundant calculations and ensures an efficient solution.

#### Algorithm

1. Handle the base case where the input array is empty. Return `0` if there are no houses.
2. Initialize the `dp` array `maxRobbedAmount` with size `N + 1`, filled with `0`. This array will store the maximum money that can be robbed starting from each house.
3. Set the base cases for the last two houses:

- `maxRobbedAmount[N]` is `0`, representing the case where no houses are left to rob.
- `maxRobbedAmount[N - 1]` is set to the value of the last house (`numbers[N - 1]`), as there are no other options for the last house.

4. Iterate backward through the houses starting from the second-to-last house (`N - 2`) down to the first house (`0`):

- For each house `i`, calculate the maximum money that can be robbed by choosing between:
  1. Skipping the current house: `maxRobbedAmount[i + 1]`.
  2. Robbing the current house and skipping the next house: `maxRobbedAmount[i + 2] + numbers[i]`.
- Store the maximum value in `maxRobbedAmount[i]`.

5. Return `maxRobbedAmount[0]`, which represents the maximum money that can be robbed starting from the first house.

```ts
export default function neighborhoodTheft(numbers: number[]): number {
  const N = numbers.length;

  // Special handling for empty case (no houses to rob).
  if (N === 0) {
    return 0;
  }

  // This array stores the maximum amount of money that can be robbed when considering up to each house.
  // Note: The calculation starts from the last house and moves backward.
  const maxRobbedAmount: number[] = new Array(N + 1).fill(0);

  // Base case initializations:
  // - maxRobbedAmount[N] (robbing the last house + next house is impossible): set to 0.
  // - maxRobbedAmount[N - 1] (robbing only the last house): set to the value in the last house.
  maxRobbedAmount[N] = 0;
  maxRobbedAmount[N - 1] = numbers[N - 1];

  // DP table calculations (iterating backwards from the second-last house):
  // For each house 'i' (from N-2 to 0):
  //   - Consider two options:
  //     1. Rob the current house 'i' and skip the next house (i+1).
  //     2. Skip the current house 'i' and rob the house after next (i+2).
  //   - Choose the option that yields the maximum total amount for ending at house 'i'.
  //   - Store the chosen maximum amount in maxRobbedAmount[i].
  for (let i = N - 2; i >= 0; i--) {
    maxRobbedAmount[i] = Math.max(
      maxRobbedAmount[i + 1],
      maxRobbedAmount[i + 2] + numbers[i],
    );
  }

  // The maximum amount the robber can steal is stored in maxRobbedAmount[0]
  // (represents the maximum achievable by ending at the first house).
  return maxRobbedAmount[0];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm processes each house exactly once in a backward iteration.
- **Space complexity: O(n)**. The `dp` array `maxRobbedAmount` requires space proportional to the number of houses.

### 3. Bottom-Up Dynamic Programming With Optimized Space

This solution builds upon the bottom-up dynamic programming approach used in the previous question but optimizes the space complexity from O(n) to O(1). In the earlier solution, a `dp` array was used to store the maximum amount that could be robbed starting from each house, requiring extra space proportional to the number of houses. However, only the last two values from this array were needed at any given time to compute the current result.

To eliminate unnecessary storage, this solution replaces the `dp` array with two variables, `prev1` and `prev2`, which store the maximum amounts for the next house (`i + 1`) and the house after that (`i + 2`). This ensures that the algorithm still computes the same results but with significantly reduced space usage.

Scan backward, updating the two stored results at each house. This keeps the same linear runtime while using two variables instead of an array.

#### Algorithm

1. Handle special cases:
1. If there are no houses, return `0`.
1. If there is only one house, return its value, as no other options exist.
1. Initialize two variables:

- `prev1` as `0`, representing the maximum money that can be robbed starting from the next house (`i + 1`).
- `prev2` as `0`, representing the maximum money that can be robbed starting from the house after the next (`i + 2`).

3. Iterate backward through the houses:
1. Calculate the maximum money that can be robbed from the current house as the maximum of: - Skipping the current house (`prev1`). - Robbing the current house and adding the value of `prev2`.
1. Update `prev2` to the current value of `prev1`, and `prev1` to the newly calculated maximum.
1. After the loop ends, `prev1` contains the maximum amount that can be robbed starting from the first house. Return this value.

```ts
export default function neighborhoodTheft(numbers: number[]): number {
  const N = numbers.length;

  // Special handling for empty case (no houses to rob).
  if (N === 0) {
    return 0;
  }

  // If there's only one house, return its value.
  if (N === 1) {
    return numbers[0];
  }

  // Initialize two variables to keep track of the maximum amounts:
  // prev1: max amount for robbing from house i+1 to the end
  // prev2: max amount for robbing from house i+2 to the end
  let prev1 = 0; // Equivalent to maxRobbedAmount[i+1]
  let prev2 = 0; // Equivalent to maxRobbedAmount[i+2]

  // Iterate backwards from the last house
  for (let i = N - 1; i >= 0; i--) {
    // Current maximum is either:
    // - Skipping the current house (prev1)
    // - Robbing the current house and adding prev2
    const current = Math.max(prev1, prev2 + numbers[i]);

    // Update prev2 and prev1 for the next iteration
    prev2 = prev1;
    prev1 = current;
  }

  // The final result is stored in prev1
  return prev1;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each house is processed exactly once in a backward iteration.
- **Space complexity: O(1)**. Only two variables are used to track intermediate results, eliminating the need for an additional array.

## Exercises

### Check your understanding 1

A right-to-left rolling DP enters an iteration with `next = best(i + 1)` and `afterNext = best(i + 2)`. Which updates preserve those meanings for the following iteration? Select all that apply.

- [x] Compute `current = max(next, value + afterNext)`, then assign `afterNext = next` and `next = current`.
  > The current result uses both old states, and the old next state becomes the next iteration's afterNext.
- [ ] Assign `next = max(next, value + afterNext)`, then `afterNext = next`.
  > The second assignment copies the new current result, losing the old next result that must be kept.
- [x] Use simultaneous assignment: `[next, afterNext] = [max(next, value + afterNext), next]`.
  > Both right-hand expressions are evaluated from the old states before either left-hand variable is overwritten.
- [ ] Assign `afterNext = next`, then `next = max(next, value + afterNext)`.
  > The recurrence now adds value to best(i + 1), which may already take the neighboring house.

### Check your understanding 2

A greedy strategy repeatedly takes the richest remaining house and discards its neighbors. Which street disproves its optimality?

- [ ] `[1, 9, 1]`
  > Taking 9 is optimal here; the alternatives sum to only 2.
- [x] `[4, 5, 4]`
  > Greedy takes 5 and discards both 4s. The non-adjacent 4s yield 8.
- [ ] `[4, 5]`
  > Only one house can be taken, so choosing the richer one is optimal.
- [ ] `[5, 1, 5]`
  > Greedy can take both endpoint houses because they are not adjacent on a line.
