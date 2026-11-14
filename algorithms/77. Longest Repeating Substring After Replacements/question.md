# Longest Repeating Substring After Replacements

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** String, Binary search

> Source: [longest-repeating-substring-after-replacements](https://www.greatfrontend.com/questions/algo/longest-repeating-substring-after-replacements)

Given a string `str` consisting of uppercase English letters and an integer `k`, determine the length of the longest substring that can be formed where all characters are the same. A maximum of `k` character replacements can be made to achieve this.

A **substring** is any contiguous sequence of characters within a string. For example, the substrings of string `abc` are `a`, `b`, `c`, `ab`, `bc`, and `abc`. A substring is formed by selecting a starting and ending point without skipping characters in between.

### Input

- `str: string`: A string
- `k`: An integer

| Input                  | Output | Explanation                                                                                                                                                       |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str = "ABCDE", k = 2` | `3`    | Modify any two characters to match each other, resulting in a maximum length of 3. For instance, change 'B' and 'C' to 'A', transforming the string into 'AAADE'. |
| `str = "AAAA", k = 3`  | `4`    | All characters are already the same, so no changes needed, and the entire string forms the longest substring.                                                     |
| `str = "AABAA", k = 2` | `5`    | By replacing 'B' with 'A', the string becomes 'AAAAA', which is the longest substring of identical characters.                                                    |

### Constraints

- 1 <= `str.length` <= 10,000
- `str` contains only uppercase English letters
- 0 <= `k` <= `str.length`

## Hints

### How many replacements does one window need?

Which single character would you keep in a window, and how many other positions would have to change?

### When should the window shrink?

Track character counts as the right edge grows. If the replacement cost exceeds `k`, move the left edge until the window can be made uniform again.

## Starter code

**TypeScript**

```ts
export default function longestSubstringReplacement(
  str: string,
  k: number,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @param {number} k
 * @return {number}
 */
export default function longestSubstringReplacement(str, k) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Sliding Window

The task is to find the length of the longest substring that can contain a single repeated character after at most `k` replacements. The required replacement count is the window length minus its maximum character frequency. Use that count to decide when to advance the left edge.

Instead of checking all possible substrings, the sliding window dynamically adjusts the window size to ensure validity. A frequency map keeps track of the occurrence of each character within the current window, and the `maxFrequency` variable helps determine the minimum replacements required to make all characters in the window the same. If the number of replacements exceeds `k`, the window size is adjusted by moving the `start` pointer forward.

#### Algorithm

1. Initialize the `start` pointer to `0`, a frequency map `frequencyMap` of size `26` (for all uppercase English letters) filled with `0`, `maxFrequency` to track the highest frequency of any character in the current window, and `longestSubstringLength` to store the length of the longest valid substring found.
2. Iterate through the string using an `end` pointer:

- Calculate the relative index of the current character in the frequency map.
- Increment the frequency of the current character in the frequency map.
- Update `maxFrequency` to the maximum frequency observed in the current window.

3. Determine whether the current window is valid by checking if the number of replacements required (`end + 1 - start - maxFrequency`) is less than or equal to `k`.

- If the window is invalid, move the `start` pointer forward:
  - Decrement the frequency of the character that is moving out of the window.
  - Increment the `start` pointer.

4. Update `longestSubstringLength` with the size of the current valid window (`end + 1 - start`).
5. Return the value of `longestSubstringLength`.

```ts
export default function longestSubstringReplacement(
  str: string,
  k: number,
): number {
  let start = 0;
  const frequencyMap: number[] = new Array(26).fill(0);
  let maxFrequency = 0;
  let longestSubstringLength = 0;

  for (let end = 0; end < str.length; end++) {
    // Calculate the relative order of the current character entering the window
    const currentChar = str.charCodeAt(end) - "A".charCodeAt(0);

    // Increment the frequency of the current character
    frequencyMap[currentChar] += 1;

    // Update the maximum frequency we've seen in any window
    maxFrequency = Math.max(maxFrequency, frequencyMap[currentChar]);

    // If the window is invalid, move the start pointer to the right
    const isValid = end + 1 - start - maxFrequency <= k;
    if (!isValid) {
      const outgoingChar = str.charCodeAt(start) - "A".charCodeAt(0);

      // Decrease the frequency of the outgoing character
      frequencyMap[outgoingChar] -= 1;

      // Move the start pointer forward
      start += 1;
    }

    // The window is valid at this point, update the length of the longest valid substring
    longestSubstringLength = end + 1 - start;
  }

  return longestSubstringLength;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The `end` pointer iterates through the string once, and the `start` pointer adjusts as needed, resulting in linear time.
- **Space complexity: O(1)**. The `frequencyMap` is of constant size (`26`), independent of the input string length.

### 2. Using Binary Search with Sliding Window

The solution combines binary search with sliding window optimization to efficiently determine the result. Binary search is used to explore the possible lengths of valid substrings. The range of possible lengths is reduced logarithmically by checking whether a substring of a given length can be made valid with at most `k` replacements. The sliding window technique verifies the validity of each length by maintaining the frequency of characters in the current window and determining whether the required replacements fall within the allowed `k`.

If a window of the candidate length can be made uniform with at most `k` replacements, search larger lengths; otherwise, search smaller ones.

#### Algorithm

1. Initialize the binary search bounds:

- Set `low` to `1`, representing the minimum possible substring length.
- Set `high` to `str.length + 1`, representing an invalid substring length beyond the input string's length.

2. Perform binary search:

- Calculate the midpoint `mid` of the current range.
- Check if a valid substring of length `mid` can be created using the helper function `canMakeValidSubstring`.
- If valid, move `low` to `mid` to explore larger substrings.
- Otherwise, move `high` to `mid` to explore smaller substrings.

3. Return `low`, which represents the largest valid substring length.
4. Use the `canMakeValidSubstring` function to verify a given length:

- Maintain a frequency map `freqMap` to track character occurrences in the current window.
- Use a sliding window to traverse the string:
  - Add the current character to the frequency map.
  - If the window size exceeds the candidate substring length, remove the character at the start of the window.
  - Update `maxFrequency` with the highest frequency observed in the current window.
  - Check if the current window can be made valid with at most `k` replacements. If valid, return `true`.
- If no valid substring of the given length is found, return `false`.

```ts
export default function longestSubstringReplacement(
  str: string,
  k: number,
): number {
  // Binary search over the length of the substring
  // `low` holds the valid value, and `high` holds the invalid value
  let low = 1;
  let high = str.length + 1;

  while (low + 1 < high) {
    const mid = low + Math.floor((high - low) / 2);

    // Check if we can make a valid substring of length `mid`
    if (canMakeValidSubstring(str, mid, k)) {
      // Explore the right half
      low = mid;
    } else {
      // Explore the left half
      high = mid;
    }
  }

  // Return the length of the longest substring that satisfies the condition
  return low;
}

// Helper function to check if a valid substring of a given length can be made
function canMakeValidSubstring(
  str: string,
  substringLength: number,
  k: number,
): boolean {
  // Frequency map to store the frequency of characters in the current window
  const freqMap: number[] = new Array(26).fill(0);
  let maxFrequency = 0;
  let start = 0;

  for (let end = 0; end < str.length; end++) {
    // Update the frequency of the current character
    freqMap[str.charCodeAt(end) - "A".charCodeAt(0)] += 1;

    // If the window [start, end] exceeds `substringLength`, move the start pointer
    if (end + 1 - start > substringLength) {
      // Decrease the frequency of the character at the start before moving the pointer
      freqMap[str.charCodeAt(start) - "A".charCodeAt(0)] -= 1;
      start += 1;
    }

    // Record the maximum frequency seen so far
    maxFrequency = Math.max(
      maxFrequency,
      freqMap[str.charCodeAt(end) - "A".charCodeAt(0)],
    );

    // Check if the current window can be made valid with at most `k` replacements
    if (substringLength - maxFrequency <= k) {
      return true;
    }
  }

  // If no valid substring of the given size was found
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. The binary search performs `O(log n)` iterations, and each iteration calls `canMakeValidSubstring`, which runs in O(n).
- **Space complexity: O(1)**. The frequency map is of fixed size (`26`), independent of the input size.

## Exercises

### Check your understanding 1

A candidate estimates replacements as “number of distinct characters minus one.” It accepts `AABBC` with budget `k = 2`. What has it overlooked?

- [ ] Only the first character of a window may be the target.
  > Any character can be the target; the best target is one with maximum frequency.
- [ ] Nothing: deleting two character categories requires exactly two replacements.
  > Replacements change individual positions, not every occurrence of a category at once.
- [ ] A tie between A and B requires one extra operation to choose a target.
  > Choosing a target costs nothing. The replacement count comes from the positions that differ from it.
- [x] Keeping either A or B still leaves three individual positions to replace.
  > The window has length 5 and maximum frequency 2. Its true cost is 3, even though only three distinct characters occur.

### Check your understanding 2

The linear solution keeps a historical `maxFrequency` that never decreases. After scanning `"AABABBA"` with `k = 1`, its final window is `"ABBA"`, of length 4, with historical maximum 3. Can that final window itself be returned as a valid answer if the task is changed to return a substring? Explain the distinction.

**Answer**

No. "ABBA" has current maximum frequency 2, so it needs two replacements. The historical count 3 came from an earlier window; it supports finding the best length but does not certify the current contents. Length 4 is achievable, for example by "AABA" with one replacement. A variant returning an actual substring must retain a genuinely feasible witness or validate candidate contents using current counts.

**Checklist**

- Compute the actual replacement cost of ABBA.
- Give an earlier feasible length-4 witness.
- Separate a historical bound used for length from current-window validity.
