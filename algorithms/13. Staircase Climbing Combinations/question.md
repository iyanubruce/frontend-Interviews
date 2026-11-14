# Staircase Climbing Combinations

**Difficulty:** Easy · **Duration:** ~20 min · **Topics:** Dynamic programming

> Source: [staircase-climbing-combinations](https://www.greatfrontend.com/questions/algo/staircase-climbing-combinations)

Given a staircase with a length of `steps`, where you can take 1 or 2 steps at a time, find the number of distinct combinations to reach the top of the staircase from the bottom of the stairs.

### Input

- `steps: number`: An integer

| Input       | Output | Explanation                                                                      |
| ----------- | ------ | -------------------------------------------------------------------------------- |
| `steps = 1` | `1`    | There is only one way i.e take 1-step                                            |
| `steps = 2` | `2`    | There are two ways, either take two 1-step or take one 2-step                    |
| `steps = 3` | `3`    | There are three ways: 1-step three times, 1-step then 2-step, 2-step then 1-step |

### Constraints

- 1 <= `steps` <= 45

## Hints

### What can the final move tell you?

Routes ending in a one-step or two-step move correspond to two smaller staircases whose counts are already available.

### Which counts are being repeated?

Sketch the recursive calls for a staircase of five steps. When the same remaining distance appears on several branches, how could its count be computed only once?

## Starter code

**TypeScript**

```ts
export default function staircaseClimbingCombinations(steps: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} steps
 * @return {number}
 */
export default function staircaseClimbingCombinations(steps) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach

This solution calculates the number of distinct ways to climb a staircase with a given number of steps using recursion. At each step, the climber can choose to take either 1 step or 2 steps. The problem is solved by recursively calculating the total number of ways to reach the top from the current step.

The algorithm uses a helper function to explore all possible combinations of steps:

1. If the current step exceeds the total number of steps, the path is invalid, so it returns 0.
2. If the current step equals the total number of steps, it represents a valid path, so it returns 1.
3. For all other cases, it recursively calculates the number of ways to reach the top by taking either 1 step or 2 steps from the current step.

This brute force approach explores all possible paths to find the total number of combinations. However, it does redundant calculations as the same subproblems are solved multiple times, which increases its computational cost.

#### Algorithm

1. Define a function `staircaseClimbingCombinations` that calls the helper function `climbFromStep` starting from step `0`.
2. The helper function `climbFromStep` takes the current step and total steps as input:
3. Return `0` if the current step exceeds the total number of steps, as it is invalid.
4. Return `1` if the current step equals the total number of steps, as it represents a valid path.
5. Recursively calculate the total number of ways by summing: - The result of taking 1 step (`climbFromStep(currentStep + 1, totalSteps)`). - The result of taking 2 steps (`climbFromStep(currentStep + 2, totalSteps)`).
6. Return the result of the helper function.

```ts
export default function staircaseClimbingCombinations(steps: number): number {
  return climbFromStep(0, steps);
}

// Helper function using recursion to find the number of ways from step i to n
function climbFromStep(currentStep: number, totalSteps: number): number {
  // If current step exceeds total steps, no valid way
  if (currentStep > totalSteps) {
    return 0;
  }
  // If current step equals total steps, one valid way found
  if (currentStep === totalSteps) {
    return 1;
  }
  // Sum of ways by taking 1 step or 2 steps
  return (
    climbFromStep(currentStep + 1, totalSteps) +
    climbFromStep(currentStep + 2, totalSteps)
  );
}
```

#### Big-O analysis

- **Time complexity: O(2n)**. Each step branches into two recursive calls, leading to an exponential number of function calls.
- **Space complexity: O(n)**. The recursion stack can grow up to the depth of `n`, where `n` is the total number of steps.

### 2. Using Dynamic Programming

This solution calculates the number of distinct ways to climb a staircase with a given number of steps using dynamic programming (DP). The problem is solved by breaking it down into smaller subproblems and storing the results of these subproblems in a `dp` array to avoid redundant calculations.

The intuition is that to reach step `i`, there are two possible ways:

1. From step `i-1` by taking one step.
2. From step `i-2` by taking two steps.

This relationship leads to the recurrence formula: `dp[i] = dp[i-1] + dp[i-2]`. Using this formula, the solution builds up the `dp` array iteratively, starting from the base cases:

- There is exactly 1 way to stay at step `0` (do nothing).
- There is exactly 1 way to reach step `1` (a single step).

The final value in `dp[steps]` gives the total number of ways to reach the top of the staircase.

#### Algorithm

1. Create a `dp` array of size `steps + 1`, initialized with `-1` to store the number of ways to reach each step.
2. Initialize the base cases:
3. Set `dp[0] = 1` since there is one way to stay at step `0`.
4. Set `dp[1] = 1` since there is one way to reach step `1` (a single step).
5. Use a loop to fill the `dp` array from step `2` to `steps`:
6. For each step `i`, calculate `dp[i]` as the sum of `dp[i-1]` (ways to reach from the previous step) and `dp[i-2]` (ways to reach from two steps before).
7. Return the value in `dp[steps]` as the total number of distinct ways to reach the top of the staircase.

```ts
export default function staircaseClimbingCombinations(steps: number): number {
  // Create an array 'dp' of size n+1 initialized with -1
  // This array will store the number of distinct ways to reach each step
  const dp: number[] = new Array(steps + 1).fill(-1);

  // Base cases
  // There is 1 way to reach step 0 (do nothing)
  dp[0] = 1;
  // There is 1 way to reach step 1 (a single step)
  dp[1] = 1;

  // Fill the dp array using the recurrence relation
  // dp[i] = dp[i-1] + dp[i-2]
  // This relation comes from the fact that you can reach step i either from step i-1 or step i-2
  for (let i = 2; i <= steps; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  // The value at dp[n] will be the number of distinct ways to reach the top of the staircase
  return dp[steps];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The `dp` array is filled in a single pass from `0` to `steps`.
- **Space complexity: O(n)**. The `dp` array requires additional space proportional to the number of steps.

## Exercises

### Check your understanding 1

Despite the word “combinations” in the title, the examples count `[1, 2]` and `[2, 1]` as different climbs. What happens if a solution counts only how many two-step moves are used for `steps = 3`?

- [ ] It still counts all three climbs.
  > Counting only the number of two-step moves identifies [1, 2] and [2, 1] as the same case.
- [x] It counts two cases and misses the distinction between the two orders.
  > There can be zero or one two-step move, but the latter has two placements. The three sequences are [1, 1, 1], [1, 2], and [2, 1].
- [ ] It counts four cases by treating the same moves as separate.
  > Ignoring order merges valid sequences; it does not create an extra one.
- [ ] It finds only [1, 1, 1] because a two-step move cannot finish at 3.
  > A two-step move combined with a one-step move reaches 3 in either order.

### Check your understanding 2

In a remaining-distance recursion, explain why “exactly zero steps remain” must return 1 while “negative steps remain” returns 0. What would a single `remaining <= 0` base case get wrong?

**Answer**

Exactly zero means one complete sequence has reached the top, so it contributes 1. A negative distance means the last move overshot and contributes 0. Returning 0 for both discards successful climbs. Returning 1 for both counts invalid overshoots: from one remaining step, a move of size 2 would be counted even though only a move of size 1 is legal.

**Checklist**

- Interpret the base values as counts of completed routes.
- Distinguish reaching the target from passing it.
- Use one remaining step to show why a shared success base case overcounts.
