# Minimum Coins for Change

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Dynamic programming

> Source: [coin-change](https://www.greatfrontend.com/questions/algo/coin-change)

Given an integer array `coins` containing coin denominations and an integer `target` denoting a total sum of money, return the minimum number of coins needed to make up the `target`. If it's not possible to make up the `target` with any combination of the coins, return `-1`.

Assume there's an infinite supply of each coin.

### Input

- `coins: number[]`: An array of integers
- `target: number`: An integer

| Input                          | Output | Explanation                                                                                                                                                                                        |
| ------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `coins = [3,7,4], target = 14` | `2`    | We can form the target amount (14) using the following combination of coins: 7 + 7. This requires a minimum of 2 coins.                                                                            |
| `coins = [1], target = 0`      | `0`    | The target amount is 0, which requires no coins to reach. Even though there's only a 1 coin available, you can still form 0 using no coins.                                                        |
| `coins = [2], target = 3`      | `-1`   | The only available coin denomination is 2. However, it's impossible to form the target amount (3) using just multiples of 2. Therefore, no combination of coins can reach 3, and the output is -1. |

### Constraints

- 1 <= `coins.length` <= 12
- 1 <= `coins[i]` <= 1,000,000
- 0 <= `target` <= 10,000

## Hints

### What remains after choosing one coin?

For each amount, compare one coin plus the best result already known for the amount left over. This turns repeated searches for the same remainder into one stored result.

### How should an impossible amount be represented?

It must not win a minimum comparison. Start amount `0` at zero coins and give unreachable amounts a value that stays out of the way.

## Starter code

**TypeScript**

```ts
export default function minimumCoinsForChange(
  coins: number[],
  target: number,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} coins
 * @param {number} target
 * @return {number}
 */
export default function minimumCoinsForChange(coins, target) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach Using Recursion

The goal is to determine the minimum number of coins needed to make up a given target amount using the available coin denominations. The brute force approach recursively tries every possible combination of coins to find the solution with the fewest coins. The recursion explores all valid ways to reduce the target amount to zero and keeps track of the minimum number of coins required.

#### Algorithm

1. Define a helper function `minimumCoinsForChangeHelper` that takes the array of coins and the remaining target amount as arguments.
2. If the target amount is `0`, return `0` as no coins are needed.
3. Initialize a variable `minCoins` to `Infinity` to keep track of the minimum coins required.
4. Iterate through the array of coins:
5. Check if the current coin denomination is less than or equal to the remaining target amount.
6. Recursively call the helper function with the remaining amount (`target - coin`).
7. If a valid solution is found and the number of coins used is less than `minCoins`, update `minCoins`.
8. After iterating through all coins, return `-1` if no valid solution is found; otherwise, return the value of `minCoins`.
9. The main function `minimumCoinsForChange` initializes the recursion by calling the helper function with the full target amount.

```ts
function minimumCoinsForChangeHelper(coins: number[], target: number): number {
  // Base case: If the amount is 0, no coins are needed.
  if (target === 0) {
    return 0;
  }

  let minCoins = Infinity;

  // Try each coin denomination.
  for (const coin of coins) {
    // Check if the coin denomination is not greater than the amount.
    if (coin <= target) {
      // Recursively calculate the minimum coins needed for the remaining amount.
      const remainingCoins = minimumCoinsForChangeHelper(coins, target - coin);

      // If a valid solution is found and it requires fewer coins, update minCoins.
      if (remainingCoins !== -1 && remainingCoins + 1 < minCoins) {
        minCoins = remainingCoins + 1;
      }
    }
  }

  // If no valid solution was found, return -1. Otherwise, return the minimum coins.
  return minCoins === Infinity ? -1 : minCoins;
}

export default function minimumCoinsForChange(
  coins: number[],
  target: number,
): number {
  return minimumCoinsForChangeHelper(coins, target);
}
```

#### Big-O analysis

- **Time complexity: O(ct)**. The recursion explores all combinations of `c` coins for the target amount `t`, resulting in exponential time complexity.
- **Space complexity: O(t)**. The recursive call stack grows proportionally to the target amount `t`.

### 2. Using Dynamic Programming

Use a `dp` array to store the minimum number of coins needed for each amount from `0` to the target. For each amount, try each possible final coin and reuse the stored result for the remaining amount, rather than recursively computing it again.

#### Algorithm

1. Initialize a `dp` array of size `target + 1` with all values set to `Number.MAX_VALUE` to represent an unreachable state.
2. Set `dp[0]` to `0` since no coins are needed to make up the amount `0`.
3. Iterate over amounts from `1` to `target`:
4. For each amount, iterate through the list of coins.
5. If the current coin can contribute to the amount (`i - coin >= 0`), update `dp[i]` with the minimum of its current value or `dp[i - coin] + 1`.
6. After filling the `dp` array, check the value at `dp[target]`:

- If it is still `Number.MAX_VALUE`, return `-1` as the target amount is not achievable.
- Otherwise, return `dp[target]` as the minimum number of coins required.

```ts
export default function minimumCoinsForChange(
  coins: number[],
  target: number,
): number {
  // Initialize a dp array with a large value (Infinity)
  const dp: number[] = new Array(target + 1).fill(Number.MAX_VALUE);

  // Base case: 0 coins are needed to make amount 0
  dp[0] = 0;

  // Iterate over each amount from 1 to the target amount
  for (let i = 1; i <= target; i++) {
    // Check each coin to see if it can contribute to the current amount
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // If the value at dp[amount] is still Infinity, return -1 (not possible)
  // Otherwise, return the minimum number of coins needed for the target amount
  return dp[target] === Number.MAX_VALUE ? -1 : dp[target];
}
```

#### Big-O analysis

- **Time complexity: O(n.t)**. Iterating over `target` amounts and checking each of the `n` coins results in O(n.t).
- **Space complexity: O(t)**. The `dp` array requires space proportional to the target amount `t`.

## Exercises

### Check your understanding 1

A DP uses `-1` for unreachable amounts but still evaluates `dp[amount - coin] + 1` without checking reachability. With coins `[2]`, which computation first invents a reachable odd amount?

- [ ] `dp[2]` from `dp[0] + 1`.
  > Amount zero is reachable using no coins; adding a two-coin denomination correctly forms amount two.
- [x] `dp[3]` from `dp[1] + 1 = 0`.
  > The arithmetic turns an impossible remainder into a zero-coin candidate. Unreachable states must be skipped or use a sentinel that cannot win the minimum.
- [ ] `dp[4]` from `dp[2] + 1`.
  > Two copies of coin `2` legitimately form amount four.

### Check your understanding 2

For coins `[1, 3, 4]` and target `6`, taking the largest affordable coin gives `4 + 1 + 1`. Explain why trying each possible final coin avoids that mistake without enumerating every full sequence.

**Answer**

The greedy first choice forces three coins, while `3 + 3` needs two. The DP considers each possible final coin: a final `3` extends the optimal solution for amount `3`, producing two coins. Every valid solution has some final coin, so these alternatives cover all possibilities. Reusing the optimal count for each smaller remainder avoids rebuilding all its sequences.

**Checklist**

- Exhibits the better two-coin construction.
- Relates each candidate to an optimal smaller remainder.
- Explains why considering final coins is exhaustive.
