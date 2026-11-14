# Find the Longest Palindromic Substring

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** String

> Source: [longest-palindromic-substring](https://www.greatfrontend.com/questions/algo/longest-palindromic-substring)

Given a string `str`, return the longest contiguous substring that is a palindrome. If there are multiple such substrings, return any one of them.

A **palindrome** is a sequence of characters that reads the same forward and backward (e.g., `racecar`).

A **substring** is any contiguous sequence of characters within a string. For example, the substrings of string `abc` are `a`, `b`, `c`, `ab`, `bc`, and `abc`. A substring is formed by selecting a starting and ending point without skipping characters in between.

### Input

- `str: string`: A string

| Input               | Output      | Explanation                                                                                           |
| ------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| `str = "cauumzssz"` | `"zssz"`    | 'zssz' is the longest palindromic substring within 'cauumzssz'.                                       |
| `str = "racecar"`   | `"racecar"` | The entire string 'racecar' is a palindrome and is the longest.                                       |
| `str = "cacae"`     | `"cac"`     | Both 'cac' and 'aca' are valid palindromic substrings of the same length, and either can be returned. |

### Constraints

- 1 <= `str.length` <= 2,000
- `str` contains only lowercase English letters

## Hints

### How does a palindrome grow from its middle?

Choose a center and compare characters at equal distances on either side, expanding while they match.

### Where is the center of an even-length palindrome?

It lies between two characters rather than on one. Each string position therefore gives you two possible kinds of center to try.

## Starter code

**TypeScript**

```ts
export default function longestPalindromeSubstring(str: string): string {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @return {string}
 */
export default function longestPalindromeSubstring(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. BruteForce

The problem requires finding the longest palindromic substring in a given string. A brute force approach systematically examines all possible substrings and checks whether each substring is a palindrome. This ensures that the algorithm correctly identifies palindromes and returns the longest one.

#### Algorithm

1. Define a helper function `check(i, j)` to determine whether the substring from index `i` to `j-1` is a palindrome:

- Initialize two pointers, `left` at `i` and `right` at `j-1`.
- Compare characters at `left` and `right` while moving the pointers toward the center.
- Return `false` if any pair of characters does not match; otherwise, return `true` if the pointers meet or cross.

2. Iterate over possible lengths of substrings in descending order:

- Start with the maximum possible length of the string and decrease the length until `1`.
- For each length, iterate over all possible starting indices for the substring.

3. For each substring, call the helper function `check` to determine if it is a palindrome:

- If the substring is a palindrome, return it immediately as the longest palindrome.

4. If no palindrome is found, return an empty string (this scenario does not occur with valid input).

```ts
export default function longestPalindromeSubstring(str: string): string {
  // Helper function to check if the substring s[i:j] is a palindrome
  const check = (i: number, j: number) => {
    let left = i; // Start pointer
    let right = j - 1; // End pointer (one less because j is exclusive)

    // Check characters from both ends moving towards the center
    while (left < right) {
      // If the characters at the current pointers don't match, it's not a palindrome
      if (str.charAt(left) !== str.charAt(right)) {
        return false;
      }

      // Move pointers closer to the center
      left++;
      right--;
    }

    // If all characters matched, it's a palindrome
    return true;
  };

  // Iterate over possible lengths of the substring, starting from the longest
  for (let length = str.length; length > 0; length--) {
    // For each length, iterate over all possible starting points of the substring
    for (let start = 0; start <= str.length - length; start++) {
      // If the substring s[start:start+length] is a palindrome, return it
      if (check(start, start + length)) {
        return str.substring(start, start + length);
      }
    }
  }

  // If no palindrome is found (though technically it shouldn't happen), return an empty string
  return "";
}
```

#### Big-O analysis

- **Time complexity: O(n3)**. The algorithm checks all substrings using two nested loops, and the palindrome check takes O(n) for each substring.
- **Space complexity: O(1)**. The algorithm uses a constant amount of extra space regardless of the input size.

### 2. Using Dynamic Programming

A dynamic programming (DP) approach optimizes the brute force method by reducing redundant checks. Instead of re-evaluating overlapping substrings, the DP approach stores intermediate results in a table `dp`, where `dp[i][j]` is `true` if the substring `s[i..j]` is a palindrome.

The dynamic programming approach iteratively builds the solution by considering substrings of increasing lengths. It starts by marking single characters as palindromes, then checks pairs of consecutive characters, and finally evaluates substrings of length 3 or more. The DP table eliminates the need for repetitive computations by ensuring that results for smaller substrings are reused when evaluating larger substrings.

#### Algorithm

1. Initialize a 2D array `dp` of size `n x n`, where `n` is the length of the string. Set all values to `false`.
2. Mark all single-character substrings as palindromes by setting `dp[i][i] = true` for all `i`.
3. Check for two-character substrings:

- For indices `i` and `i + 1`, if `str[i] === str[i + 1]`, set `dp[i][i + 1] = true` and update the indices of the longest palindrome.

4. Iterate over possible lengths of substrings starting from 3:

- For each length, iterate over possible starting indices `i`.
- Compute the ending index `j = i + length - 1`.
- If `str[i] === str[j]` and `dp[i + 1][j - 1]` is `true`, set `dp[i][j] = true` and update the indices of the longest palindrome.

5. Extract the substring using the indices of the longest palindrome stored in the variable `ans`.
6. Return the extracted substring.

```ts
export default function longestPalindromeSubstring(str: string): string {
  const n = str.length;

  // Initialize a 2D array `dp` where dp[i][j] will be true if the substring s[i..j] is a palindrome
  const dp: boolean[][] = Array.from(Array(n), () => Array(n).fill(false));

  // `ans` will store the starting and ending indices of the longest palindromic substring found
  let ans = [0, 0];

  // Every single character is a palindrome, so set dp[i][i] to true for all i
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // Check for palindromes of length 2 (i.e., pairs of consecutive characters)
  for (let i = 0; i < n - 1; i++) {
    if (str[i] === str[i + 1]) {
      dp[i][i + 1] = true;
      ans = [i, i + 1]; // Update the longest palindrome indices
    }
  }

  // Check for palindromes of length 3 and greater
  for (let diff = 2; diff < n; diff++) {
    for (let i = 0; i < n - diff; i++) {
      let j = i + diff;
      // If the characters at the start and end of the substring are equal
      // and the substring s[i+1..j-1] is a palindrome, then s[i..j] is a palindrome
      if (str[i] === str[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        ans = [i, j]; // Update the longest palindrome indices
      }
    }
  }

  // Extract the longest palindromic substring from the string using the indices stored in `ans`
  const i = ans[0];
  const j = ans[1];
  return str.slice(i, j + 1);
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The algorithm iterates over all substrings of the string, and each substring evaluation takes constant time due to the use of the DP table.
- **Space complexity: O(n2)**. The DP table requires storage proportional to the square of the string length.

### 3. Expanding from Centers

The expanding around the center approach is an efficient solution that avoids constructing a dynamic programming table or checking all substrings. The key idea is to treat each character (or pair of characters) as the center of a potential palindrome and expand outward to find the largest palindrome around that center.

For every character (or pair of characters for an even-length palindrome), expand outward until a mismatch or a string boundary is reached. No DP table is needed.

#### Algorithm

1. Define a helper function `expand(i, j)`:

- Initialize two pointers, `left` at `i` and `right` at `j`.
- Expand the pointers outward while `left` is non-negative, `right` is within bounds, and the characters at `left` and `right` are equal.
- Return the substring bounded by `left + 1` and `right` as the palindrome.

2. Initialize a variable `ans` to store the longest palindromic substring found.
3. Iterate through each character in the string:

- Treat the character at index `i` as the center of an odd-length palindrome. Call `expand(i, i)` and update `ans` if the returned palindrome is longer than the current value of `ans`.
- Treat the characters at indices `i` and `i + 1` as the centers of an even-length palindrome. Call `expand(i, i + 1)` and update `ans` if the returned palindrome is longer than the current value of `ans`.

4. Return the value of `ans` after processing all characters.

```ts
export default function longestPalindromeSubstring(str: string): string {
  // Helper function to expand around a center and find the longest palindromic substring
  function expand(i: number, j: number): string {
    let left: number = i; // Start pointer for the left side of the potential palindrome
    let right: number = j; // Start pointer for the right side of the potential palindrome

    // Expand outwards while the characters on both sides are equal
    // and the pointers are within bounds of the string
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      left--; // Move left pointer to the left
      right++; // Move right pointer to the right
    }

    // Return the substring that is the palindrome found
    // Note: left + 1 and right are used to get the correct bounds of the palindrome
    return str.slice(left + 1, right);
  }

  let ans: string = ""; // Initialize the variable to store the longest palindromic substring

  // Iterate through each character in the string as potential centers of palindromes
  for (let i = 0; i < str.length; i++) {
    // Find the longest odd-length palindrome with center at `i`
    let odd: string = expand(i, i);
    // Update the result if the found palindrome is longer than the previous longest
    if (odd.length > ans.length) {
      ans = odd;
    }

    // Find the longest even-length palindrome with centers at `i` and `i + 1`
    let even: string = expand(i, i + 1);
    // Update the result if the found palindrome is longer than the previous longest
    if (even.length > ans.length) {
      ans = even;
    }
  }

  // Return the longest palindromic substring found
  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. For each character, the expansion may run in O(n) in the worst case, resulting in O(n2) overall.
- **Space complexity: O(1)**. The algorithm uses a constant amount of extra space, excluding the space required for the output.

## Exercises

### Check your understanding 1

A test for input `"babad"` insists the result equal `"bab"`. Explain why that test is too strict and describe assertions that accept every correct answer without accepting a shorter palindrome or a non-contiguous subsequence.

**Answer**

The contract permits any longest palindrome, and "aba" is another valid length-3 answer. Check that the result is a contiguous substring of the input, that it equals its reverse, and that its length is 3. Each check matters: containment excludes invented strings or subsequences, symmetry excludes ordinary substrings, and the optimal length excludes a shorter palindrome such as "b".

**Checklist**

- Recognize both bab and aba as permitted answers.
- Check contiguous membership and palindrome symmetry independently.
- Check the known optimal length rather than one preferred spelling.

### Check your understanding 2

A center-expansion implementation tries only character centers `(i, i)`. Which test catches the missing kind of center?

- [ ] `"cabac"`
  > Its longest palindrome has b as a character center, so the implementation finds it.
- [ ] `"abcd"`
  > A one-character answer is optimal and character centers suffice.
- [x] `"abba"`
  > The longest palindrome is centered in the gap between the two b characters. Character centers find only length 1 here.
- [ ] `"a"`
  > The only substring has a character center.
