# Palindromic Substrings

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** String

> Source: [string-palindromic-substrings](https://www.greatfrontend.com/questions/algo/string-palindromic-substrings)

Given a string `str`, determine the total number of substrings that are palindromes.

A **palindrome** is a sequence of characters that reads the same forward and backward (e.g., `racecar`).

A **substring** is any contiguous sequence of characters within a string. For example, the substrings of string `abc` are `a`, `b`, `c`, `ab`, `bc`, and `abc`. A substring is formed by selecting a starting and ending point without skipping characters in between.

### Input

- `str: string`: A string

| Input             | Output | Explanation                                                                                      |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------ |
| `str = "cat"`     | `3`    | The palindromic substrings are 'c', 'a', and 't'.                                                |
| `str = "racecar"` | `10`   | The palindromic substrings are 'r', 'a', 'c', 'e', 'c', 'a', 'r', 'cec', 'aceca', and 'racecar'. |
| `str = "bbb"`     | `6`    | The palindromic substrings are 'b', 'b', 'b', 'bb', 'bb', and 'bbb'.                             |

### Constraints

- 1 <= `str.length` <= 1,000
- `str` contains only lowercase English letters

## Hints

### Where can a palindrome be centered?

Mark the centers of `aba` and `abba`. One lies on a character and the other between two characters; do those two kinds of center account for every palindrome length?

### What can one center contribute?

Starting at a chosen center, compare characters at equal distances on either side. Count how many substrings remain palindromes as that distance grows, and notice when further growth can stop.

## Starter code

**TypeScript**

```ts
export default function countPalindromicSubstrings(str: string): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @return {number}
 */
export default function countPalindromicSubstrings(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using brute force

A brute force approach checks every possible substring to determine if it is a palindrome. This is achieved by iterating through all possible starting and ending indices of substrings and using a helper function to validate if the substring is palindromic. A substring is a palindrome if it reads the same forward and backward.

#### Algorithm

1. Define a helper function `isPalindrome`:

- Take the string `str`, a starting index `low`, and an ending index `high`.
- Use a `while` loop to compare characters at `low` and `high`.
- If the characters do not match, return `false`.
- Increment `low` and decrement `high` to move toward the center.
- Return `true` if all characters match.

2. Initialize a variable `ans` to store the count of palindromic substrings.
3. Use a nested loop:

- The outer loop iterates over all possible starting indices `low` of substrings.
- The inner loop iterates over all possible ending indices `high` for the current starting index.
- For each pair of indices, check if the substring is a palindrome using the `isPalindrome` function.
- Increment `ans` by `1` if the substring is a palindrome.

4. Return the value of `ans` as the total count of palindromic substrings.

```ts
function isPalindrome(str: string, low: number, high: number): boolean {
  // Continue checking as long as the left index is less than the right index
  while (low < high) {
    // If characters at low and high do not match, it's not a palindrome
    if (str[low] !== str[high]) {
      return false;
    }
    // Move towards the center
    low++;
    high--;
  }
  // If all characters matched, it's a palindrome
  return true;
}

export default function countPalindromicSubstrings(str: string): number {
  let ans = 0;

  // Iterate over all possible starting points of substrings
  for (let low = 0; low < str.length; low++) {
    // Iterate over all possible ending points of substrings starting at low
    for (let high = low; high < str.length; high++) {
      // Increment ans if the substring s[low...high] is a palindrome
      ans += isPalindrome(str, low, high) ? 1 : 0;
    }
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n3)**. There are O(n2) substrings, and checking each substring for palindrome takes O(n) time.
- **Space complexity: O(1)**. The algorithm uses constant space aside from the input string and loop variables.

### 2. Using Dynamic Programming

The dynamic programming approach improves the naive brute force method by avoiding repeated checks of overlapping substrings. The key intuition is that a substring is a palindrome if its two outermost characters are the same and the inner substring (excluding the outer characters) is also a palindrome. This recursive property is efficiently captured using a dynamic programming table.

The `dp` table stores whether a substring starting at index `i` and ending at index `j` is a palindrome. This eliminates redundant recalculations by building solutions incrementally, starting with smaller substrings and using their results to solve for larger substrings.

#### Algorithm

1. Handle the base case for an empty string by returning `0`.
2. Initialize a 2D array `dp` of size `n x n` with all values set to `false`.
3. Iterate through the string for substrings of length `1`:

- Set `dp[i][i]` to `true` for all indices `i` since single-character substrings are always palindromes.
- Increment the count `ans` for each single-character palindrome.

4. Iterate through the string for substrings of length `2`:

- Set `dp[i][i + 1]` to `true` if the two characters at indices `i` and `i + 1` are equal.
- Increment the count `ans` for each double-character palindrome.

5. Use nested loops to evaluate substrings of length `3` and greater:

- For each substring starting at index `i` and ending at index `j`, set `dp[i][j]` to `true` if:
  - The characters at `i` and `j` are the same.
  - The substring between `i` and `j` (`dp[i + 1][j - 1]`) is also a palindrome.
- Increment the count `ans` for each palindrome found.

6. Return `ans` as the total count of palindromic substrings.

```ts
export default function countPalindromicSubstrings(str: string): number {
  const n = str.length;
  let ans = 0;

  // If the string is empty, return 0
  if (n === 0) {
    return 0;
  }

  // Initialize a 2D array (dp) to store whether substrings are palindromic
  const dp: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  // Base case: single letter substrings are always palindromes
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
    ans++; // Count single letter palindromes
  }

  // Base case: check double letter substrings
  for (let i = 0; i < n - 1; i++) {
    dp[i][i + 1] = str[i] === str[i + 1];
    ans += dp[i][i + 1] ? 1 : 0; // Count double letter palindromes
  }

  // Check all other substrings of length 3 to n
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1; // Ending index of the substring
      dp[i][j] = dp[i + 1][j - 1] && str[i] === str[j];
      ans += dp[i][j] ? 1 : 0; // Count palindromes of length len
    }
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The outer loop iterates through substring lengths, and the inner loop iterates through all starting indices for substrings.
- **Space complexity: O(n2)**. The `dp` table requires O(n2) space to store results for all substrings.

### 3. Using Centers of Palindromes

The expanding from center approach optimizes the process of finding all palindromic substrings by focusing on potential centers of palindromes. The key intuition is that every palindrome can be expanded outward from its center. A center can either be a single character (for odd-length palindromes) or a pair of consecutive characters (for even-length palindromes). By iteratively expanding from each center, this approach avoids redundant calculations and does not require the use of additional space for a dynamic programming table.

This method improves upon the previous dynamic programming approach by reducing space usage. Instead of precomputing palindromic substrings for all possible lengths, it directly counts palindromes during the expansion process.

#### Algorithm

1. Initialize a variable `ans` to store the total count of palindromic substrings.
2. Iterate through each character in the string:

- Treat the character at the current index as the center of an odd-length palindrome and call the helper function `countPalindromesAroundCenter` with the same starting and ending index.
- Treat the current character and the next character as the center of an even-length palindrome and call the helper function `countPalindromesAroundCenter` with consecutive indices as the starting and ending points.

3. Return `ans` as the total count of palindromic substrings.

##### Helper function: `countPalindromesAroundCenter`

1. Take the string `str`, a starting index `low`, and an ending index `high` as input.
2. Initialize a variable `ans` to store the count of palindromes found during expansion.
3. Use a `while` loop to expand outward as long as:

- The indices `low` and `high` are within the bounds of the string.
- The characters at `low` and `high` match.

4. Increment `ans` for each valid palindrome.
5. Decrement `low` and increment `high` to continue expanding.
6. Return the count `ans`.

```ts
export default function countPalindromicSubstrings(str: string): number {
  let ans = 0;

  // Iterate through each character in the string
  for (let i = 0; i < str.length; i++) {
    // Count odd-length palindromes with a single character center
    ans += countPalindromesAroundCenter(str, i, i);

    // Count even-length palindromes with consecutive characters as the center
    ans += countPalindromesAroundCenter(str, i, i + 1);
  }

  return ans;
}

function countPalindromesAroundCenter(
  str: string,
  low: number,
  high: number,
): number {
  let ans = 0;

  // Expand around the center as long as the characters at the edges match
  while (low >= 0 && high < str.length) {
    if (str[low] !== str[high]) {
      break; // Stop if characters don't match
    }

    // Expand the window outward
    low--;
    high++;

    // Increment the palindrome count
    ans++;
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. For each character, the expansion can span the entire string in the worst case, leading to O(n) expansions for O(n) centers.
- **Space complexity: O(1)**. The algorithm uses constant extra space for variables and does not require additional data structures.

## Exercises

### Check your understanding 1

There are only `2n - 1` possible character and gap centers. Why does expanding around them still take quadratic time in the worst case? Use a string of n identical characters and explain why the counting process does not count one range twice.

**Answer**

Every nonempty substring of an all-identical string is a palindrome, so there are n + (n - 1) + ... + 1 = n(n + 1) / 2 successful expansions. A linear number of centers can each do more than constant work. Each positional range has one unique midpoint and one radius around that midpoint, so it is counted exactly once despite overlapping other palindromes.

**Checklist**

- Count all positional substrings of the identical-character input.
- Distinguish the number of centers from the work per center.
- Use the unique midpoint and radius to rule out duplicate counting.

### Check your understanding 2

A candidate puts every palindrome it finds into a set of strings and returns the set size. For `"aaa"`, how does that differ from the required count?

- [ ] It returns 3, which is correct because there are three characters.
  > The task includes longer ranges and counts equal text at different positions separately.
- [ ] The set contains 6 entries, so there is no difference.
  > A set merges the three a occurrences and the two aa occurrences by their text.
- [x] It returns 3 instead of 6.
  > The set holds a, aa, and aaa. The required occurrences are three length-1 ranges, two length-2 ranges, and one length-3 range.
- [ ] It returns 1 instead of 3.
  > The set retains different lengths as different strings; aaa is not equal to aa or a.
