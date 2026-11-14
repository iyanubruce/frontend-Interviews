# Neighborhood Theft (Circular)

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Arrays, Dynamic programming

> Source: [neighborhood-theft-circular](https://www.greatfrontend.com/questions/algo/neighborhood-theft-circular)

An experienced robber is planning a heist on a circular street. Every house contains a certain amount of money, and all houses are arranged in a circle, meaning the first house is next to the last one. Additionally, adjacent houses have connected security systems that alert the police if two neighboring houses are robbed on the same night.

Given an array of integers `numbers`, where each element represents the amount of money in a house, return the maximum amount of money the robber can steal without triggering the alarm.

### Input

- `numbers: number[]`: An array of integers

### Notes

- The robber cannot steal from two adjacent houses

| Input                         | Output | Explanation                                                                                                                         |
| ----------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `numbers = [1,2,3,1]`         | `4`    | The robber can steal a maximum of 4 by robbing house at index 0 (value 1) and house at index 2 (value 3).                           |
| `numbers = [2,7,9,3,1]`       | `11`   | The robber can steal a maximum of 11 by robbing house at index 0 (value 2), house at index 2 (value 9).                             |
| `numbers = [3,6,1,0,6,0,0,9]` | `21`   | The robber can steal a maximum of 21 by robbing house at index 1 (value 6), house at index 4 (value 6), house at index 7 (value 9). |

### Constraints

- 1 <= `numbers.length` <= 100
- 0 <= `numbers[i]` <= 400

## Hints

### How can the endpoint conflict be removed?

The first and last houses cannot both be chosen. Every valid plan therefore excludes at least one of them, giving two linear ranges to compare.

### How is each linear range solved?

At a house, compare skipping it with taking its value plus the best total that stops before its neighbor. Handle the one-house circle before excluding either endpoint.

## Starter code

**TypeScript**

```ts
export default function neighborhoodTheftCircular(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function neighborhoodTheftCircular(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Top-Down Dynamic Programming

This solution extends the neighborhood theft problem to a circular arrangement of houses. In this scenario, the first and last houses are adjacent, so they cannot both be robbed. The solution uses a divide-and-conquer approach by breaking the circular problem into two linear subproblems:

1. Exclude the first house and calculate the maximum amount from the rest.
2. Exclude the last house and calculate the maximum amount from the rest.

These subproblems are solved using a top-down dynamic programming approach with memoization. The helper function `robWithMemo` computes the maximum amount that can be robbed from a given range of houses by recursively exploring two options for each house:

- Rob the current house and skip the next one.
- Skip the current house and move to the next.

Memoization ensures that intermediate results are cached, avoiding redundant calculations and improving efficiency. The final result is the maximum of the two subproblems, representing the optimal solution for the circular arrangement.

#### Algorithm

1. Handle special cases:

- If there are no houses, return `0`.
- If there is only one house, return its value.

2. Define a helper function `robWithMemo` to calculate the maximum money that can be robbed from a given range of houses:
1. Initialize a `memo` array to store intermediate results, filled with `-1` to indicate uncomputed values.
1. Define a recursive function `dp(i)`: - Return `0` if `i` exceeds the range's end, as no houses are left to rob. - Return the cached value in `memo[i]` if already computed. - Calculate the maximum money for the current house by choosing between:
   - Robbing the current house and adding the result of skipping the next house (`numbers[i] + dp(i + 2)`).
   - Skipping the current house and moving to the next house (`dp(i + 1)`). - Cache the result in `memo[i]` and return it.
1. Start the recursion from the given range's start index and return the result.
1. Compute two subproblems:

- Maximum money excluding the first house (`robWithMemo(numbers, 1, numbers.length - 1)`).
- Maximum money excluding the last house (`robWithMemo(numbers, 0, numbers.length - 2)`).

4. Return the maximum of the two results.

```ts
export default function neighborhoodTheftCircular(numbers: number[]): number {
  // If there are no houses, return 0
  if (numbers.length === 0) return 0;
  // If there is only one house, return the amount in that house
  if (numbers.length === 1) return numbers[0];

  // Calculate the maximum amount of money that can be robbed by excluding either the first or the last house
  const max1 = robWithMemo(numbers, 0, numbers.length - 2);
  const max2 = robWithMemo(numbers, 1, numbers.length - 1);

  // Return the maximum amount from the two calculated values
  return Math.max(max1, max2);
}

// Helper function to find the maximum amount of money that can be robbed from a range of houses using memoization
function robWithMemo(numbers: number[], start: number, end: number): number {
  // Initialize the memoization array with -1 indicating uncomputed values
  const memo: number[] = new Array(numbers.length).fill(-1);

  // Recursive function with memoization
  function dp(i: number): number {
    // Base case: if i is beyond the end of the range, return 0
    if (i > end) return 0;

    // Return the cached value if it's already computed
    if (memo[i] !== -1) return memo[i];

    // Recursively compute the maximum amount by choosing to rob or not rob the current house
    const robCurrent = numbers[i] + dp(i + 2); // Rob current house and move to the house after next
    const skipCurrent = dp(i + 1); // Skip current house and move to the next house

    // Store the result in the memo array
    memo[i] = Math.max(robCurrent, skipCurrent);

    return memo[i];
  }

  // Start the recursion from the starting index
  return dp(start);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each subproblem processes all houses in its range once, resulting in linear time complexity.
- **Space complexity: O(n)**. The memoization array requires space proportional to the number of houses in the range.

### 2. Bottom-Up Dynamic Programming

The first and last houses are neighbors, so they cannot both be robbed. As in the recursive version, solve two linear cases:

1. Rob houses from the second to the last, excluding the first house.
2. Rob houses from the first to the second-to-last, excluding the last house.

By solving these two linear subproblems independently, the circular constraint is effectively handled. The results of these two cases are then compared to determine the maximum amount that can be robbed.

Each of these subproblems is solved using a space-optimized dynamic programming approach. Instead of maintaining a full `dp` array to store the maximum amounts for all houses, two variables are used to track the results for the current house and the previous house. This reduces the space complexity while ensuring that the optimal solution for each subproblem is calculated efficiently.

For each linear case, choose between robbing the current house plus the best result two houses away and skipping it for the best result one house away. Return the larger result from the two cases.

#### Algorithm

1. Check if the `numbers` array is empty. If it is, return `0` because there are no houses to rob.
2. Check if the `numbers` array has only one house. If it does, return the value of that house.
3. Solve two linear subproblems:

- Call `robSimple` with the range from index `0` to `n - 2` (excluding the last house).
- Call `robSimple` with the range from index `1` to `n - 1` (excluding the first house).

4. Return the maximum of the two results.
5. Define the helper function `robSimple` to solve the linear robbery problem:
6. Initialize two variables, `t1` and `t2`, to `0`. These represent the maximum amounts that can be robbed up to the current and previous houses.
7. Iterate through the range of houses from `start` to `end`: - Calculate the maximum amount that can be robbed at the current house as the maximum of:
   - Robbing the current house and adding `t2` (representing the maximum amount robbed up to two houses before).
   - Skipping the current house and using `t1` (representing the maximum amount robbed up to the previous house). - Update `t2` to the value of `t1`. - Update `t1` to the calculated maximum.
8. After the loop, return `t1`, which contains the maximum amount that can be robbed in the range.

```ts
export default function neighborhoodTheftCircular(numbers: number[]): number {
  // If there are no houses, return 0
  if (numbers.length === 0) return 0;
  // If there is only one house, return the amount in that house
  if (numbers.length === 1) return numbers[0];

  // Calculate the maximum amount of money that can be robbed by excluding either the first or the last house
  const max1 = robSimple(numbers, 0, numbers.length - 2);
  const max2 = robSimple(numbers, 1, numbers.length - 1);

  // Return the maximum amount from the two calculated values
  return Math.max(max1, max2);
}

// Helper function to find the maximum amount of money that can be robbed from a range of houses
function robSimple(numbers: number[], start: number, end: number): number {
  let t1 = 0,
    t2 = 0;

  // Iterate over the range of houses
  for (let i = start; i <= end; i++) {
    // Store the current value of t1 in a temporary variable
    const temp = t1;
    // Update t1 to be the maximum of robbing the current house plus the amount from t2, or the current value of t1
    t1 = Math.max(numbers[i] + t2, t1);
    // Update t2 to the previous value of t1
    t2 = temp;
  }

  // Return the maximum amount of money that can be robbed from the given range of houses
  return t1;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each house is processed exactly once in two linear iterations of the helper function.
- **Space complexity: O(1)**. Only two variables, `t1` and `t2`, are used to track intermediate results.

## Exercises

### Check your understanding 1

A top-down solution solves the ranges excluding the last house and excluding the first house. Can those two calls safely share a memo table keyed only by the current index? Use `[1, 2, 100]` to explain.

**Answer**

No. A suffix result depends on the allowed end index as well as the current index. In the first range [0, 1], the cached result at index 1 is 2. Reusing it for the second range [1, 2] incorrectly excludes the house containing 100, whose range optimum is 100. Give each range a fresh memo table or include the end bound in the memo key.

**Checklist**

- Explain that the same starting index can describe two different suffixes.
- Contrast the results at index 1 under the two end bounds.
- Propose separate memo tables or a key containing the range end.

### Check your understanding 2

For circular house amounts `[5, 1, 1, 5]`, what is the maximum valid total?

- [ ] `10`
  > The two houses containing `5` are adjacent through the circular boundary, so they cannot both be robbed.
- [x] `6`
  > Either the first `5` with the third house or the second house with the last `5` forms a valid non-adjacent total of `6`.
- [ ] `5`
  > One of the non-adjacent middle houses can be combined with a `5`, producing more than the endpoint alone.
- [ ] `7`
  > Any three selected houses in a four-house circle include at least one adjacent pair, so that total is invalid.
