# Decode Message

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** String, Dynamic programming

> Source: [string-decode-message](https://www.greatfrontend.com/questions/algo/string-decode-message)

A secret message is encoded as a string of digits, where each digit or pair of digits represents a letter according to the following mapping:

`'1' → 'A', '2' → 'B', ..., '26' → 'Z'`

The message can be decoded in multiple ways depending on how the digits are grouped. For example, the string "226" can be interpreted as:

- "2 26" u2192 'BZ'
- "22 6" u2192 'VF'
- "2 2 6" u2192 'BBF'

Given a string `str` that contains only digits, find out how many ways it can be decoded. If the string cannot be decoded in any valid way, return `0`.

### Input

- `str: string`: String consisting only of digits to decode

### Notes

- The test cases are designed so that the answer fits within a 32-bit integer
- There may be strings that are impossible to decode
- Not all digit groupings are valid. For example, "06" is invalid since numbers cannot have leading zeros

| Input          | Output | Explanation                                                                                                |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `str = "225"`  | `3`    | '225' can be decoded as 'BY' (2 25), 'VE' (22 5), or 'BBE' (2 2 5).                                        |
| `str = "10"`   | `1`    | '10' can be decoded as 'J' (10).                                                                           |
| `str = "1106"` | `1`    | '1106' can be decoded as 'AJF' (1 10 6). The grouping (11 06) is invalid because '06' is not a valid code. |

### Constraints

- 1 <= `str.length` <= 100

## Hints

### How can a decoding end?

If the final letter of `226` consumes one digit or two, which shorter prefix remains in each case?

### What does a zero change?

Try the same reasoning on `06`, `10`, and `101`. For each position, decide whether its final one-digit and two-digit groups are actually valid.

### Where does the work repeat?

Draw the decoding choices for `1111`. Several branches ask for the count of the same remaining substring; consider how to reuse that result instead of exploring it again.

## Starter code

**TypeScript**

```ts
export default function decodeMessage(str: string): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {str} str
 * @return {number}
 */
export default function decodeMessage(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Top-Down Dynamic Programming

The problem of decoding a string into possible letter combinations can be visualized as navigating a decision tree. Each step in the string offers two choices: decode a single character or decode two characters (if they form a valid number between `10` and `26`). The goal is to count all valid decoding paths from the beginning to the end of the string.

A recursive solution can decode the same suffix repeatedly. Store the decoding count for each starting index in a memoization map so later calls reuse the result.

#### Algorithm

1. Define a recursive function `recursiveWithMemo` that:

- Takes the current index, the input string, and a memoization map as arguments.
- Checks if the result for the current index exists in the `memo` and returns it if found.
- Returns `1` if the index reaches the end of the string (valid decode).
- Returns `0` if the current character is `'0'` (invalid decode).
- Returns `1` if the current index points to the last character (valid decode).

2. Initialize a variable `ans` with the result of decoding the single character at the current index by calling `recursiveWithMemo` with `index + 1`.
3. Check if the next two characters form a valid number between `10` and `26`:

- If valid, add the result of decoding two characters by calling `recursiveWithMemo` with `index + 2`.

4. Store the computed result for the current index in the `memo` map.
5. Return the value stored in `memo` for the current index.
6. Implement a wrapper function `decodeMessage` that:

- Initializes an empty `Map` for memoization.
- Calls `recursiveWithMemo` with the initial index `0` and the input string.

```ts
// Recursive function with memoization to count the number of ways to decode a string
function recursiveWithMemo(
  index: number, // Current index in the string
  str: string, // The input string to decode
  memo: Map<number, number>, // Memoization map to store previously computed results
): number {
  // If the result for the current index is already computed, return it from the memo
  if (memo.has(index)) {
    return memo.get(index)!;
  }
  // If the current index has reached the end of the string, return 1 (valid decode)
  if (index === str.length) {
    return 1;
  }
  // If the current character is '0', return 0 (no valid decode)
  if (str.charAt(index) === "0") {
    return 0;
  }
  // If the current index is the last character, return 1 (single valid decode)
  if (index === str.length - 1) {
    return 1;
  }

  // Initialize the answer by decoding one character
  let ans = recursiveWithMemo(index + 1, str, memo);

  // Check if the next two characters form a valid number <= 26 and decode it
  if (parseInt(str.substring(index, index + 2)) <= 26) {
    ans += recursiveWithMemo(index + 2, str, memo);
  }

  // Store the computed result in the memo map
  memo.set(index, ans);
  return ans;
}

export default function decodeMessage(str: string): number {
  let memo = new Map<number, number>();
  return recursiveWithMemo(0, str, memo);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each index is processed only once due to memoization.
- **Space complexity: O(n)**. The `Map` stores up to `n` entries, and the recursion stack requires O(n) space in the worst case.

### 2. Bottom-Up Dynamic Programming

Instead of solving subproblems recursively, this approach iteratively computes the number of ways to decode the string by using results from smaller substrings. The intuition is to maintain a `dp` array where each entry represents the number of ways to decode the substring up to that index.

Fill the `dp` array from left to right, using the previous one or two entries to compute each new count. Each prefix is computed once, without recursive calls.

#### Algorithm

1. Initialize a `dp` array of size `str.length + 1` with all values set to `0`.

- Set `dp[0]` to `1` since there is one way to decode an empty string.
- Set `dp[1]` to `1` if the first character is not `'0'`, otherwise set it to `0`.

2. Iterate from index `2` to `str.length`:

- If the current character is not `'0'`, add `dp[i - 1]` to `dp[i]` for single-digit decoding.
- Extract the last two characters as a two-digit number. If it is between `10` and `26`, add `dp[i - 2]` to `dp[i]` for two-digit decoding.

3. Return the value in `dp[str.length]`, which represents the number of ways to decode the entire string.

```ts
export default function decodeMessage(str: string): number {
  // DP array to store the subproblem results
  const dp: number[] = new Array(str.length + 1).fill(0);

  // Base case: There's one way to decode an empty string
  dp[0] = 1;

  // Ways to decode a string of size 1 is 1, unless the string is '0'
  dp[1] = str[0] === "0" ? 0 : 1;

  // Iterate through the string to fill the DP array
  for (let i = 2; i <= str.length; i++) {
    // Check if successful single digit decode is possible
    if (str[i - 1] !== "0") {
      dp[i] += dp[i - 1];
    }

    // Check if successful two-digit decode is possible
    const twoDigit = parseInt(str.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
  }

  // The last element in the DP array contains the number of ways to decode the entire string
  return dp[str.length];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm iterates through the string once.
- **Space complexity: O(n)**. The `dp` array stores intermediate results for each index of the string.

### 3. Bottom-Up Dynamic Programming With Constant Space

This solution improves the bottom-up dynamic programming approach by reducing the space complexity to O(1). Instead of maintaining a `dp` array to store the results for all indices, this approach keeps track of only the last two results (`dp[i-2]` and `dp[i-1]`). This optimization is possible because the number of ways to decode a string at any position depends only on the results of the previous two positions.

#### Algorithm

1. Handle the edge case where the string is empty by returning `0`.
2. Initialize two variables:

- `prev` to represent `dp[i-2]`, set to `1` for the base case of an empty string.
- `curr` to represent `dp[i-1]`, set to `1` if the first character is not `'0'`, otherwise set to `0`.

3. Iterate from index `2` to `str.length`:

- Initialize a temporary variable `temp` to store the current result.
- If the current character is not `'0'`, add `curr` to `temp` for single-digit decoding.
- Extract the last two characters as a two-digit number. If it is between `10` and `26`, add `prev` to `temp` for two-digit decoding.
- Update `prev` to `curr` and `curr` to `temp` for the next iteration.

4. Return the value of `curr`, which contains the number of ways to decode the entire string.

```ts
export default function decodeMessage(str: string): number {
  // Handle edge case: empty string
  if (str.length === 0) return 0;

  // Variables to store the last two results
  let prev = 1; // Represents dp[i-2], initialized for empty string
  let curr = str[0] === "0" ? 0 : 1; // Represents dp[i-1]

  // Iterate through the string
  for (let i = 2; i <= str.length; i++) {
    let temp = 0; // Temporarily store the current dp[i]

    // Check if successful single-digit decode is possible
    if (str[i - 1] !== "0") {
      temp += curr;
    }

    // Check if successful two-digit decode is possible
    const twoDigit = parseInt(str.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      temp += prev;
    }

    // Update prev and curr for the next iteration
    prev = curr;
    curr = temp;
  }

  // The last value of curr contains the result
  return curr;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The solution iterates through the string once.
- **Space complexity: O(1)**. Only two variables are used to store intermediate results.

## Exercises

### Check your understanding 1

A DP update uses `if` for a valid one-digit ending and `else if` for a valid two-digit ending, instead of adding both contributions when both are valid. Which test detects the missing branch?

- [x] `"12"`, which has 2 decodings.
  > Both 1 | 2 and 12 are valid. The else-if skips the two-digit contribution after the single-digit condition succeeds.
- [ ] `"10"`, which has 1 decoding.
  > The single-digit condition fails on 0, so the else-if still counts the valid pair.
- [ ] `"27"`, which has 1 decoding.
  > Only the single-digit ending is valid; no second contribution is lost.
- [ ] `"06"`, which has 0 decodings.
  > The previous prefix has zero ways and 06 is not a valid two-digit token; both versions return zero.

### Check your understanding 2

How many valid decodings does the digit string `2101` have when letters map to numbers `1` through `26`?

- [ ] `0`
  > The zero can participate in the valid token `10`, so it does not make the entire string undecodable.
- [ ] `2`
  > Splits containing `01` or a standalone `0` are invalid, leaving no second valid tokenization.
- [x] `1`
  > The only valid tokenization is `2 | 10 | 1`; alternatives leave the zero alone or give it a leading zero.
- [ ] `3`
  > Counting ordinary splits without validating the zero-containing token overstates the number of valid mappings.
