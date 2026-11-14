# Optimal Stock Trading

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Arrays, Greedy

> Source: [optimal-stock-trading](https://www.greatfrontend.com/questions/algo/optimal-stock-trading)

Given a list of `prices`, where each element `prices[i]` represents the price of a particular stock on day `i`, determine the maximum profit to be made by purchasing the stock and selling it on a future date. If it is not possible to generate a profit, return `0`.

### Input

- `prices: number[]`: An array of integers representing the stock price on each day

| Input                      | Output | Explanation                                                                            |
| -------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `prices = [1,2,3,4]`       | `3`    | Buy the stock at day 1 (price = 1) and sell it on day 4 (price = 4), profit: 4 - 1 = 3 |
| `prices = [4,3,2,1]`       | `0`    | Not possible to profit because the prices is only declining                            |
| `prices = [6,8,1,2,30,19]` | `29`   | Buy at day 3 (price = 1) and sell it on day 5 (price = 30), profit: 30 - 1 = 29        |

### Constraints

- 1 <= `prices.length` <= 10,000
- 0 <= `prices[i]` <= 10,000

## Hints

### Which earlier purchase is best for a sale today?

Only the lowest price seen so far matters. Compare today's possible profit against the best profit from earlier days as the scan moves forward.

## Starter code

**TypeScript**

```ts
export default function optimalStockTrading(prices: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
export default function optimalStockTrading(prices) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach

This solution calculates the maximum profit that can be achieved by buying and selling a stock on different days using a brute force approach. The idea is to evaluate all possible pairs of days and calculate the profit for each pair. The maximum profit is determined by comparing all the calculated profits.

For each day, the algorithm assumes it to be the buying day and iterates through all subsequent days to check for possible selling days. The profit for each pair is calculated as the difference between the selling price and the buying price. The maximum profit encountered during these comparisons is stored and returned as the result.

#### Algorithm

1. Initialize a variable `maxProfit` to `0` to store the maximum profit encountered.
2. Use a nested loop to iterate through all possible pairs of days:
3. The outer loop represents the buying day (`i`), iterating from the first day to the second-to-last day.
4. The inner loop represents the selling day (`j`), iterating from the day after `i` to the last day.
5. For each pair of days:
6. Calculate the profit as the difference between the price on the selling day (`prices[j]`) and the price on the buying day (`prices[i]`).
7. If the calculated profit is greater than `maxProfit`, update `maxProfit` with the new profit value.
8. After all iterations, return `maxProfit` as the maximum profit that can be achieved.

```ts
export default function optimalStockTrading(prices: number[]): number {
  // Initialize the maximum profit to 0
  let maxProfit = 0;

  // Iterate through each day's price
  for (let i = 0; i < prices.length - 1; i++) {
    // For each day, compare it with the prices of the subsequent days
    for (let j = i + 1; j < prices.length; j++) {
      // Calculate the profit by subtracting the current day's price from the future day's price
      const profit = prices[j] - prices[i];

      // If the calculated profit is greater than the current maximum profit, update the maximum profit
      if (profit > maxProfit) {
        maxProfit = profit;
      }
    }
  }

  // Return the maximum profit
  return maxProfit;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The nested loops iterate over all pairs of days, resulting in a quadratic time complexity.
- **Space complexity: O(1)**. No additional data structures are used; only a few variables are required for calculations.

### 2. Greedy Approach

This solution calculates the maximum profit that can be achieved by buying and selling a stock on different days using a greedy approach. The algorithm focuses on minimizing unnecessary calculations by keeping track of the lowest price encountered so far and calculating the profit dynamically as the iteration progresses.

The key idea is to maintain two variables:

1. `lowestPrice`, which tracks the minimum price encountered so far in the array.
2. `maxProfit`, which tracks the maximum profit possible based on the current `lowestPrice` and the current price.

For each price in the array, the algorithm updates `lowestPrice` if the current price is lower. It then calculates the potential profit by subtracting `lowestPrice` from the current price and updates `maxProfit` if the calculated profit is greater. This approach eliminates the need to compare all pairs of prices, reducing the time complexity significantly compared to the brute force approach.

#### Algorithm

1. Initialize `maxProfit` to `0` to store the maximum profit encountered.
2. Initialize `lowestPrice` to a very large value (`Number.MAX_SAFE_INTEGER`) to track the smallest price encountered so far.
3. Iterate through each price in the `prices` array:
4. Update `lowestPrice` with the smaller value between `lowestPrice` and the current price.
5. Calculate the potential profit as the difference between the current price and `lowestPrice`.
6. Update `maxProfit` with the larger value between `maxProfit` and the potential profit.
7. After completing the iteration, return `maxProfit` as the maximum profit that can be achieved.

```ts
export default function optimalStockTrading(prices: number[]): number {
  // Initialize maximum profit to 0, assuming no profit initially
  let maxProfit: number = 0;

  // Track the lowest buying price seen so far
  let lowestPrice: number = Number.MAX_SAFE_INTEGER;

  for (const currentPrice of prices) {
    // Update the lowest buying price if a lower price is encountered
    lowestPrice = Math.min(lowestPrice, currentPrice);

    // Calculate potential profit for the current price
    const potentialProfit: number = currentPrice - lowestPrice;

    // Update the maximum profit if a higher potential profit is found
    maxProfit = Math.max(maxProfit, potentialProfit);
  }

  return maxProfit;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm traverses the list of prices once, updating `lowestPrice` and calculating `maxProfit` in constant time for each price.
- **Space complexity: O(1)**. Only two variables, `lowestPrice` and `maxProfit`, are used to track intermediate results.

## Exercises

### Check your understanding 1

Why is `max(prices) - min(prices)` not enough for a single legal trade? Use `[9, 2, 7, 1]` to contrast that expression with a prefix-minimum scan, and explain why remembering just the lowest earlier price is sufficient for each possible sale.

**Answer**

The global expression gives 9 - 1 = 8, but that would buy on the last day and sell on the first. The legal best trade buys at 2 and sells later at 7 for profit 5. For a fixed selling day, every legal purchase lies in its earlier prefix; the smallest such purchase maximizes sale minus purchase. Keeping that minimum and the best profit across selling days covers all legal pairs without comparing them individually.

**Checklist**

- Respect the buy-before-sell order in the example.
- Explain optimal purchase choice for a fixed selling day.
- Connect the scan over sale days to coverage of all legal transactions.

### Check your understanding 2

What should the function return for prices `[8, 6, 4, 2]`?

- [ ] Return `-2`.
  > The function is not required to make a losing trade; initializing the best profit to zero prevents a negative result.
- [ ] Return `6`.
  > Buying at the final price `2` and selling at the earlier price `8` would reverse chronological order and is not allowed.
- [ ] Return `4`.
  > A price difference is valid only when the lower purchase occurs before the higher sale, which never happens here.
- [x] Return `0`.
  > Every possible future sale is below its earlier purchase price, and the contract uses zero when no profitable transaction exists.
