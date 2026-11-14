# Longest Non-repeating Substring

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** String

> Source: [longest-non-repeating-substring](https://www.greatfrontend.com/questions/algo/longest-non-repeating-substring)

Given a string `str`, determine the length of the longest substring that does not contain any repeating characters.

A **substring** is any contiguous sequence of characters within a string. For example, the substrings of string `abc` are `a`, `b`, `c`, `ab`, `bc`, and `abc`. A substring is formed by selecting a starting and ending point without skipping characters in between.

### Input

- `str: string`: A string

| Input               | Output | Explanation                                                                                                                 |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `str = "abcdefg"`   | `7`    | The entire string 'abcdefg' has no repeating characters, so the longest substring is the entire string itself.              |
| `str = "dvdf"`      | `3`    | The longest substring without repeating characters is 'vdf'.                                                                |
| `str = "aabbccdde"` | `2`    | The longest substrings without repeating characters are 'ab', 'bc', 'cd', 'de'. Each of these substrings has a length of 2. |

### Constraints

- 0 <= `str.length` <= 10,000
- `str` contains only lowercase English letters

## Hints

### What should stay true about the current window?

Keep a contiguous window with no repeated character. Its right edge always moves forward; the left edge advances only when a newly added character breaks that rule.

### How far should a repeat move the left edge?

Remember where each character most recently appeared. An occurrence already outside the current window must never move the left edge backward.

## Starter code

**TypeScript**

```ts
export default function longestUniqueSubstring(str: string): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @return {number}
 */
export default function longestUniqueSubstring(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

The task is to find the length of the longest substring without repeating characters in a given string. A brute force approach iterates through all possible substrings, ensuring each substring contains unique characters. By using a `visited` array to track the characters encountered, the algorithm ensures that duplicates are detected within the current substring. The result is updated whenever a larger substring without repeating characters is found.

#### Algorithm

1. Initialize a variable `res` to store the length of the longest substring without repeating characters, and set it to `0`.
2. Iterate through each possible starting index `i` of the substring:

- Initialize a `visited` array of size `256` (to represent all ASCII characters) and set all entries to `false`.

3. For each starting index `i`, iterate through all possible ending indices `j`:

- If the character at index `j` has already been marked as visited, break the inner loop.
- Otherwise, calculate the current substring length as `j - i + 1` and update `res` with the maximum value between `res` and the current substring length.
- Mark the character at index `j` as visited in the `visited` array.

4. Return the value of `res` after completing all iterations.

```ts
export default function longestUniqueSubstring(str: string): number {
  let n = str.length; // Get the length of the input string
  let res = 0; // Variable to store the length of the longest substring without repeating characters

  // Iterate over all possible starting points of substrings
  for (let i = 0; i < n; i++) {
    // Initializing all characters as not visited
    let visited = new Array(256).fill(false);

    for (let j = i; j < n; j++) {
      // If current character is visited
      // Break the loop
      if (visited[str.charCodeAt(j)] === true) {
        break;
      } else {
        // Else update the result if this window is larger,
        // and mark current character as visited.
        res = Math.max(res, j - i + 1);
        visited[str.charCodeAt(j)] = true;
      }
    }
  }
  return res;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The outer loop iterates `n` times, and for each starting index, the inner loop may iterate up to `n` times in the worst case.
- **Space complexity: O(1)**. The `visited` array has a fixed size of 256, which does not depend on the input size.

### 2. Using Sliding Window

Instead of iterating through all substrings, the sliding window dynamically adjusts its size based on the position of duplicate characters. This reduces the time complexity from O(n2) to O(n).

The sliding window method eliminates unnecessary recomputation by maintaining a window of unique characters. A `map` is used to store the last seen position of each character, enabling efficient updates to the window boundaries. When a duplicate character is encountered, the starting index of the window (`left`) is adjusted to exclude the duplicate. This ensures all substrings are checked in linear time.

#### Algorithm

1. Initialize a `map` to store the last seen positions of characters in the string.
2. Initialize variables `maxLen` to track the length of the longest substring and `left` to represent the start index of the current window.
3. Iterate through the string using `right` as the end index of the window:

- If the current character exists in the `map` and its last seen position is within the current window, update `left` to `Math.max(map.get(str[right]), left)` to exclude the duplicate.
- Update `maxLen` to `Math.max(maxLen, right - left + 1)` to store the length of the longest substring found so far.
- Update the `map` with the current character's position as `right + 1` to handle 0-based indexing.

4. Return `maxLen` after the iteration is complete.

```ts
export default function longestUniqueSubstring(str: string): number {
  // Create a map to store the last seen position of each character in the string
  const map = new Map<string, number>();

  // Initialize variables to keep track of the maximum length of the substring without repeating characters
  let maxLen = 0;

  // 'left' is the starting index of the current substring being evaluated
  let left = 0;

  // Iterate over the string with 'right' as the end index of the current substring
  for (let right = 0; right < str.length; right++) {
    // If the current character has been seen before and is within the current substring
    if (map.has(str[right])) {
      // Move the 'left' pointer to the right of the last seen position of the current character
      // This ensures the substring being evaluated doesn't contain duplicate characters
      left = Math.max(map.get(str[right])!, left);
    }

    // Update the maximum length of the substring found so far
    maxLen = Math.max(maxLen, right - left + 1);

    // Store the current character's position in the map, adding 1 to handle 0-based indexing
    map.set(str[right], right + 1);
  }

  // Return the length of the longest substring without repeating characters
  return maxLen;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each character is processed once when moving the `right` pointer, and each duplicate character is processed once when adjusting the `left` pointer.
- **Space complexity: O(n)**. The `map` stores the last seen positions of characters, which could require space proportional to the size of the input string.

## Exercises

### Check your understanding 1

An alternative uses a set for the current window and repeatedly removes the leftmost character until the new rightmost character can be added without duplication. It has a loop inside a loop. Explain why its total work is still linear, and why removing just one character is insufficient.

**Answer**

Each position enters the window once and leaves at most once, so across the entire scan the inner loop performs at most n removals. With constant-time set operations, the total is O(n). One removal may not reach the conflicting character: when adding the second c in "abcc", removing a still leaves c in the window; b and the earlier c must also leave.

**Checklist**

- Bound all removals together by the forward movement of left.
- State the set-operation assumption for the linear bound.
- Give a repeat whose earlier occurrence is not at the left edge.

### Check your understanding 2

Using zero-based indices, process `abba` with a sliding window that stores each character's last index and updates `left = max(left, last index + 1)` on a repeat. What are `(left boundary after the final character, longest length)`?

- [x] `(2, 2)`
  > The second `b` moves `left` to `2`, and the old `a` at index `0` cannot move it backward when the final `a` is processed.
- [ ] `(1, 3)`
  > Moving `left` back to `1` would create the repeated window `bba`, so neither boundary nor length is valid.
- [ ] `(3, 2)`
  > The prior `a` lies outside the current window, so the final `a` can remain with the `b` at index `2` and does not force `left` to `3`.
- [ ] `(0, 4)`
  > The full string repeats both `a` and `b`, so it is not a valid unique-character window.
