# Shortest Substring Containing Characters

**Difficulty:** Hard · **Duration:** ~45 min · **Topics:** String

> Source: [string-shortest-substring-containing-characters](https://www.greatfrontend.com/questions/algo/string-shortest-substring-containing-characters)

Given two strings, `str1` and `str2`, return the smallest substring of `str1` that contains every character from `str2` (including duplicates). If no such substring exists, return an empty string.

A **substring** is any contiguous sequence of characters within a string. For example, the substrings of string `abc` are `a`, `b`, `c`, `ab`, `bc`, and `abc`. A substring is formed by selecting a starting and ending point without skipping characters in between.

### Input

- `str1`: A string
- `str2`: A string

### Notes

- If multiple solutions exist, you may return any of them

| Input                              | Output    | Explanation                                                                                         |
| ---------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `str1 = "ABCD", str2 = "AC"`       | `"ABC"`   | The substring 'ABC' contains both 'A' and 'C'                                                       |
| `str1 = "AAABBBCCC", str2 = "ABC"` | `"ABBBC"` | The substring 'ABBBC' contains 'A', 'B', and 'C', making it the smallest valid substring.           |
| `str1 = "A", str2 = "AA"`          | `""`      | str1 does not have enough 'A's to match the two required in str2, so the result is an empty string. |

### Constraints

- 1 <= `str1.length`, `str2.length` <= 10,000
- `str1` and `str2` contains only uppercase English letters

## Hints

### What makes a window valid?

Use a target such as `AABC` and compare a few candidate substrings. Why is knowing that each character appears at least once insufficient, and what counts would let you recognize full coverage?

### When can each boundary move?

Grow a window until it first becomes valid, then try moving its left edge inward. Notice what event forces you to grow the right edge again, and record the best valid span seen along the way.

## Starter code

**TypeScript**

```ts
export default function shortestSubstringContainingCharacters(
  str1: string,
  str2: string,
): string {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
export default function shortestSubstringContainingCharacters(str1, str2) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Sliding Window

Expand the right edge of a window in `str1` until its character counts cover `str2`, including repeated characters. Then shrink the left edge while coverage holds, recording the shortest valid substring.

#### Algorithm

1. Handle edge cases:

- If either string is empty, return an empty string.

2. Create a `Map` `dictT` to store the frequency of each character in `str2`.
3. Initialize variables:

- `required` to store the number of unique characters in `str2`.
- Two pointers `left` and `right` for the sliding window.
- `formed` to track the number of unique characters in the current window that meet the required frequency.
- `windowCounts` to track character counts in the current window.
- `ans` to store the smallest valid window found, initialized to `[-1, 0, 0]` (length, left index, right index).

4. Expand the window by incrementing the `right` pointer:

- Add the character at `right` to `windowCounts`.
- If the count of the current character matches its count in `dictT`, increment `formed`.

5. Contract the window by incrementing the `left` pointer while `formed` equals `required`:

- Check if the current window is smaller than the previously found smallest window. If so, update `ans`.
- Remove the character at `left` from `windowCounts`.
- If the count of the character falls below its count in `dictT`, decrement `formed`.

6. Continue expanding and contracting until `right` reaches the end of `str1`.
7. Return the substring corresponding to the smallest window in `ans`, or an empty string if no valid window exists.

```ts
export default function shortestSubstringContainingCharacters(
  str1: string,
  str2: string,
): string {
  // Edge case: If either string is empty, return an empty string.
  if (str1.length === 0 || str2.length === 0) {
    return "";
  }

  // Dictionary to keep track of the frequency of each character in `str2`.
  let dictT: Map<string, number> = new Map();
  for (let i = 0; i < str2.length; i++) {
    dictT.set(str2.charAt(i), (dictT.get(str2.charAt(i)) || 0) + 1);
  }

  // Number of unique characters in `str2` that must be present in the desired window.
  let required: number = dictT.size;

  // Pointers for the sliding window technique.
  let left = 0,
    right = 0;

  // `formed` tracks how many unique characters in the current window match the desired count.
  let formed: number = 0;

  // Dictionary to count the characters in the current window.
  let windowCounts: Map<string, number> = new Map();

  // Result placeholder to store the smallest window found (length, left index, right index).
  let ans: number[] = [-1, 0, 0];

  // Expand the window by moving the right pointer (`right`) to the right.
  while (right < str1.length) {
    // Add the character at the right pointer to the window's counts.
    let c: string = str1.charAt(right);
    windowCounts.set(c, (windowCounts.get(c) || 0) + 1);

    // If the current character's count in the window matches its count in `str2`, increase `formed`.
    if (dictT.has(c) && windowCounts.get(c) === dictT.get(c)) {
      formed++;
    }

    // Try to contract the window by moving the left pointer (`left`) to the right.
    while (left <= right && formed === required) {
      c = str1.charAt(left);

      // Update the result if this window is smaller than the previously found smallest window.
      if (ans[0] === -1 || right - left + 1 < ans[0]) {
        ans[0] = right - left + 1;
        ans[1] = left;
        ans[2] = right;
      }

      // Remove the character at the left pointer from the window's counts.
      windowCounts.set(c, windowCounts.get(c)! - 1);

      // If the count of this character in the window falls below its count in `str2`, reduce `formed`.
      if (dictT.has(c) && windowCounts.get(c)! < dictT.get(c)!) {
        formed--;
      }

      // Move the left pointer to the right, contracting the window.
      left++;
    }

    // Move the right pointer to the right, expanding the window.
    right++;
  }

  // Return the smallest window found, or an empty string if no such window exists.
  return ans[0] === -1 ? "" : str1.substring(ans[1], ans[2] + 1);
}
```

#### Big-O analysis

- **Time complexity: O(n + m)**. The `right` pointer iterates through `str1` (O(n)), and the `left` pointer contracts the window as needed. The `Map` operations for checking and updating counts are O(1) on average. Constructing the frequency map for `str2` takes O(m), where `m` is the length of `str2`.
- **Space complexity: O(n + m)**. The `windowCounts` and `dictT` maps require O(n + m) space to store character frequencies.

### 2. Using Optimized Sliding Window

The optimized sliding window approach improves efficiency by filtering `str1` to include only characters that exist in `str2`. This reduces the number of iterations and comparisons required during the sliding window process. The key intuition is that irrelevant characters in `str1` can be ignored since they do not contribute to forming the required substring. By working with a filtered version of `str1`, the algorithm processes only relevant characters, making it faster than the previous implementation.

Filtering reduces window operations most when many characters in `str1` are absent from `str2`. The rules for expanding and shrinking the window remain the same.

#### Algorithm

1. Handle the base case:

- If either `str1` or `str2` is empty, return an empty string.

2. Build a frequency map `dictT` for `str2` to track the required count of each character.
3. Filter `str1` to include only characters that exist in `str2`, storing them as tuples of their index and character in `filteredStr1`.
4. Initialize sliding window pointers `left` and `right`, a variable `formed` to track characters meeting their required frequency, and a `windowCounts` map to count characters in the current window.
5. Use a sliding window:

- Expand the window by incrementing the `right` pointer.
- Update `windowCounts` and increment `formed` if the character at `right` meets the required count in `dictT`.
- Contract the window by incrementing the `left` pointer as long as all required characters are present:
  - Update the result if the current window is smaller than the previously found one.
  - Decrease the count of the character being removed from `windowCounts`, and decrement `formed` if it falls below the required count.

6. Return the substring corresponding to the smallest window or an empty string if no valid window is found.

```ts
export default function shortestSubstringContainingCharacters(
  str1: string,
  str2: string,
): string {
  // If either input string is empty, return an empty string as there's no valid window
  if (str1.length === 0 || str2.length === 0) {
    return "";
  }

  // Build a frequency map of characters in `str2` (target string)
  const dictT: Record<string, number> = {};
  for (let char of str2) {
    dictT[char] = (dictT[char] || 0) + 1; // Increment count of each character
  }

  // The number of unique characters in `str2` that must appear in the desired window
  const required = Object.keys(dictT).length;

  // Filter `str1` to include only characters present in `str2`
  // Store as tuples of [index, character]
  const filteredStr1: [number, string][] = [];
  for (let i = 0; i < str1.length; i++) {
    const char = str1[i];
    if (char in dictT) {
      filteredStr1.push([i, char]); // Keep only relevant characters with their indices
    }
  }

  // Initialize sliding window pointers
  let left = 0,
    right = 0;

  // Track how many characters from `dictT` have their required frequency in the current window
  let formed = 0;

  // A map to count characters in the current window
  const windowCounts: Record<string, number> = {};

  // Result to store the smallest window found: [window length, left index, right index]
  let ans: [number, number, number] = [-1, 0, 0];

  // Expand the window by moving the `right` pointer
  while (right < filteredStr1.length) {
    // Character at the right pointer in the filtered string
    const char = filteredStr1[right][1];
    windowCounts[char] = (windowCounts[char] || 0) + 1; // Increment count in the window

    // If the current character's count matches the required count, increment `formed`
    if (dictT[char] && windowCounts[char] === dictT[char]) {
      formed++;
    }

    // Try contracting the window from the left as long as all required characters are present
    while (left <= right && formed === required) {
      // Get the actual indices of the current window from the filtered string
      const start = filteredStr1[left][0];
      const end = filteredStr1[right][0];

      // Update the result if the current window is smaller than the previously found one
      if (ans[0] === -1 || end - start + 1 < ans[0]) {
        ans = [end - start + 1, start, end];
      }

      // Character to be removed from the window as the left pointer moves
      const charToRemove = filteredStr1[left][1];
      windowCounts[charToRemove] -= 1; // Decrement count in the window

      // If the character's count falls below the required count, decrement `formed`
      if (
        dictT[charToRemove] &&
        windowCounts[charToRemove] < dictT[charToRemove]
      ) {
        formed--;
      }

      // Move the left pointer to shrink the window
      left++;
    }

    // Move the right pointer to expand the window
    right++;
  }

  // If no valid window is found, return an empty string
  return ans[0] === -1 ? "" : str1.substring(ans[1], ans[2] + 1);
}
```

#### Big-O analysis

- **Time complexity: O(n + m)**. Filtering `str1` takes linear time proportional to the length of `str1`, and the sliding window operates on the filtered string, which has a length proportional to the number of characters in `str2`.
- **Space complexity: O(n + m)**. The space used for the frequency map and the window counts is proportional to the number of characters in `str2`, while the filtered version of `str1` uses space proportional to the length of `str1`.

## Exercises

### Check your understanding 1

For `str1 = "ABAAC"` and `str2 = "AAC"`, which value is the shortest substring of `str1` containing every target character with its required multiplicity?

- [x] `"AAC"`
  > This contiguous length-three substring contains two `A` characters and one `C`, exactly satisfying the target counts.
- [ ] `"AC"`
  > This substring contains only one `A`, so it does not satisfy the duplicate `A` requirement.
- [ ] `"BAAC"`
  > This substring is valid, but `"AAC"` is a shorter valid substring inside it.
- [ ] `""`
  > A valid substring exists, so the no-solution result is not appropriate.

### Check your understanding 2

An optimized scan filters `str1 = "AXXXBYYAB"` to relevant entries for target `"AB"`. It sees `[(0, A), (4, B), (7, A), (8, B)]`. Why is minimizing the number of filtered entries wrong, and which span should be returned?

**Answer**

Each neighboring pair covers A and B using two filtered entries, but their original spans have lengths 5, 4, and 2: "AXXXB", "BYYA", and "AB". The answer is the final "AB" at indices 7 through 8. Compare original end - start + 1 when choosing a candidate, and slice the original string so any irrelevant characters inside the chosen boundaries remain present.

**Checklist**

- Compute original span lengths rather than filtered-entry counts.
- Choose the final indices 7 through 8.
- Preserve contiguity by returning a slice of the original input.
