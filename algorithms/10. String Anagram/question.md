# String Anagram

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** String

> Source: [string-anagram](https://www.greatfrontend.com/questions/algo/string-anagram)

Given two strings `str1` and `str2`, determine if `str2` is an anagram of `str1` and return `true` if it is, and `false` otherwise.

An anagram is a word or phrase formed by rearranging the letters of another word or phrase, using all the original letters exactly once. For example, the words `listen` and `silent` are anagrams because they use the same letters with the same frequency, but in a different order.

### Input

- `str1`: A string
- `str2`: A string

| Input                              | Output  | Explanation                                                                           |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `str1 = "abcd", str2 = "dcba"`     | `true`  | Both strings contain the same characters with the same frequency in different orders. |
| `str1 = "hello", str2 = "bello"`   | `false` | The strings do not contain the same characters.                                       |
| `str1 = "listen", str2 = "silent"` | `true`  | Both strings contain the same characters with the same frequency in different orders. |

### Constraints

- 1 <= `str1.length`, `str2.length` <= 1,000
- `str1` and `str2` consist of lowercase English letters only

## Hints

### What information survives a rearrangement?

Try comparing `aab` with both `aba` and `abb`. What must match besides the set of characters, and how could you compare that information without checking every possible ordering?

## Starter code

**TypeScript**

```ts
export default function isStringAnagram(str1: string, str2: string): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str1
 * @param {string} str2
 * @return {boolean}
 */
export default function isStringAnagram(str1, str2) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Sorting

The problem is to determine whether two strings are anagrams of each other. Two strings are anagrams if they contain the same characters in the same frequency, but in any order. The key insight of this approach is that sorting both strings will rearrange their characters in the same order if they are anagrams. After sorting, a simple comparison of the two sorted arrays can determine if the strings are anagrams.

Sorting provides a straightforward way to align the characters in both strings, making it easy to check for equality.

#### Algorithm

1. Check if the lengths of `str1` and `str2` are different. If they are, return `false` because strings of different lengths cannot be anagrams.
2. Split `str1` and `str2` into character arrays using the `split` method.
3. Sort the character arrays using the `sort` method.
4. Iterate through the sorted arrays and compare characters at each index.

- If any character in the two arrays does not match, return `false`.

5. If all characters match, return `true`.

```ts
export default function isStringAnagram(str1: string, str2: string): boolean {
  // If the lengths of the two strings are not equal, they cannot be anagrams
  if (str1.length !== str2.length) {
    return false;
  }

  // Convert the strings into character arrays
  let str1Array: string[] = str1.split("");
  let str2Array: string[] = str2.split("");

  // Sort the character arrays
  str1Array.sort();
  str2Array.sort();

  // Check if the sorted character arrays are equal
  for (let i = 0; i < str1Array.length; i++) {
    if (str1Array[i] !== str2Array[i]) {
      return false;
    }
  }

  // If all checks pass, the strings are anagrams
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the character arrays is the most expensive operation and dominates the runtime.
- **Space complexity: O(n)**. The space is required to store the character arrays created from the input strings.

### 2. Using Frequency Count

This solution optimizes the anagram-checking process by using a frequency count approach. Instead of sorting the strings, which requires O(n log n) time, the solution uses an array of fixed size (26 for the English alphabet) to count character occurrences. The frequency table is updated for each string: incrementing for one string and decrementing for the other. If the counts for all characters are zero at the end, the strings are anagrams.

#### Algorithm

1. Check if the lengths of the two strings are different.

- If they are, return `false` since the strings cannot be anagrams.

2. Initialize an array of size 26 with all elements set to 0 to act as a frequency table.
3. Iterate through the first string.

- For each character, increment its corresponding position in the frequency table.

4. Iterate through the second string.

- For each character, decrement its corresponding position in the frequency table.
- If any count in the table goes below zero, return `false`.

5. After both iterations, if no count is negative, return `true` as the strings are anagrams.

```ts
export default function isAnagram(str1: string, str2: string): boolean {
  // If the lengths of the two strings are not equal, they cannot be anagrams
  if (str1.length !== str2.length) {
    return false;
  }

  // Create an array to count the frequency of each character in the alphabet
  const table: number[] = new Array(26).fill(0);

  // Increment the count for each character in string s
  for (let i = 0; i < str1.length; i++) {
    table[str1.charCodeAt(i) - "a".charCodeAt(0)]++;
  }

  // Decrement the count for each character in string t
  for (let i = 0; i < str2.length; i++) {
    table[str2.charCodeAt(i) - "a".charCodeAt(0)]--;
    // If count goes negative, strings are not anagrams
    if (table[str2.charCodeAt(i) - "a".charCodeAt(0)] < 0) {
      return false;
    }
  }

  // If all counts are zero, strings are anagrams
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The solution iterates through both strings exactly once.
- **Space complexity: O(1)**. The frequency table is a fixed size (26), regardless of the input size.

## Exercises

### Check your understanding 1

The frequency solution checks equal lengths, counts every character of the first string, then decrements for the second string and rejects any negative count. It returns true without a final scan for leftover positive counts. Why is that sound, and why would removing the length check make it unsound?

**Answer**

Equal lengths mean the total number of decrements equals the total initial count, so the final sum is zero. If no count went negative, all remaining counts are nonnegative; a zero sum then forces every count to be zero. Without equal lengths, str1 = "aab" and str2 = "ab" use only available letters, so no decrement is negative, yet an a remains. The final true would be wrong.

**Checklist**

- Use equal lengths to establish a final total count of zero.
- Combine the zero sum with nonnegative counts.
- Show leftover letters when the length precondition is removed.

### Check your understanding 2

A candidate checks equal length and equal sets of distinct characters, then returns true. Which pair gets through both checks even though it is not an anagram pair?

- [ ] `"abc"` and `"abd"`
  > The distinct-character sets differ, so the candidate correctly rejects this pair.
- [ ] `"ab"` and `"aab"`
  > The length check already rejects the pair.
- [x] `"aab"` and `"abb"`
  > Both lengths are 3 and both sets are {a, b}, but the frequencies of a and b differ.
- [ ] `"aab"` and `"aba"`
  > This pair really is an anagram pair, so accepting it does not expose the bug.
