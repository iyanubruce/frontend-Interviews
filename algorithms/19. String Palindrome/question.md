# String Palindrome

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** String

> Source: [string-palindrome](https://www.greatfrontend.com/questions/algo/string-palindrome)

Given a string `str`, determine if it is a palindrome. Return `true` if it is, and `false` otherwise.

A string is a palindrome if, after changing all uppercase letters to lowercase and discarding all non-alphanumeric characters, it remains identical when read forward and backward. Alphanumeric characters consist of both letters and numbers.

### Input

- `str: string`: A string

| Input                                  | Output  | Explanation                                                                                                                              |
| -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `str = "No 'x' in Nixon"`              | `true`  | After removing non-alphanumeric characters and converting to lowercase, the string becomes 'noxinnixon', which is a palindrome.          |
| `str = "Was it a car or a cat I saw?"` | `true`  | After removing non-alphanumeric characters and converting to lowercase, the string becomes 'wasitacaroracatisaw', which is a palindrome. |
| `str = "tab a cat"`                    | `false` | After removing non-alphanumeric characters and converting to lowercase, the string becomes 'tabacat', which is not a palindrome.         |

### Constraints

- 1 <= `str.length` <= 2,000
- The string `str` consists only of printable ASCII characters

## Hints

### Which characters actually need to match?

Apply the prompt's filtering and case rules to a short example, then compare characters that are equally far from its two ends. How could you make those comparisons without generating every possible substring?

## Starter code

**TypeScript**

```ts
export default function isStringPalindrome(str: string): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @return {boolean}
 */
export default function isStringPalindrome(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Comparing the Reverse Order

The solution identifies whether a string is a palindrome by focusing only on its alphanumeric characters and ignoring case sensitivity. The key intuition is that a palindrome's sequence of characters must be identical when reversed. Therefore, this approach will reverse the input string and compare the reversed string with original string to check whether they are similar. To simplify the comparison, the solution preprocesses the string by filtering out non-alphanumeric characters and converting the remaining ones to lowercase. This creates a normalized version of the string, making the reverse comparison straightforward.

#### Algorithm

1. Initialize an empty string `filteredChars` to store alphanumeric characters in lowercase.
2. Iterate through each character of the input string:

- If the character is alphanumeric, convert it to lowercase and append it to `filteredChars`.

3. Reverse the `filteredChars` string using `split`, `reverse`, and `join`.
4. Compare the original `filteredChars` with the reversed version.

- If they are the same, return `true` as the string is a palindrome.
- Otherwise, return `false`.

```ts
export default function isStringPalindrome(str: string): boolean {
  // Initialize an empty string to store filtered characters
  let filteredChars = "";

  // Iterate through each character in the input string
  for (let ch of str) {
    // Check if the character is alphanumeric (a-z, A-Z, 0-9)
    if (ch.match(/[a-z0-9]/i)) {
      // Convert the character to lowercase and add it to the filteredChars string
      filteredChars += ch.toLowerCase();
    }
  }

  // Reverse the filtered characters string
  const reversedChars = filteredChars.split("").reverse().join("");

  // Compare the original filtered string with the reversed string
  // If they are the same, it is a palindrome
  return filteredChars === reversedChars;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Filtering the characters and reversing the string each takes linear time.
- **Space complexity: O(n)**. The `filteredChars` and `reversedChars` strings both require O(n) space.

### 2. Using two pointers

This solution improves on the previous one by avoiding the creation of a reversed string, which requires additional time and space. The two-pointer approach determines whether a string is a palindrome by using two indices, one starting at the beginning of the string and the other at the end, and moving toward the center. This removes the need to reverse the string, as comparisons can be made directly between corresponding characters.

#### Algorithm

1. Initialize two pointers:

- One (`left`) at the start of the string.
- The other (`right`) at the end of the string.

2. While `left` is less than `right`:

- Skip non-alphanumeric characters by moving `left` forward and `right` backward until valid characters are found.
- Convert both characters to lowercase for case-insensitive comparison.
- If the characters at `left` and `right` are not equal, return `false`.
- Otherwise, move `left` forward and `right` backward to continue comparisons.

3. If all characters match, return `true`.

```ts
export default function isStringPalindrome(str: string): boolean {
  let i = 0; // Initialize the left pointer
  let j = str.length - 1; // Initialize the right pointer

  // Loop until the left pointer is less than the right pointer
  while (i < j) {
    // Move the left pointer to the right if the current character is not alphanumeric
    while (i < j && !isLetterOrDigit(str.charAt(i))) {
      i++;
    }

    // Move the right pointer to the left if the current character is not alphanumeric
    while (i < j && !isLetterOrDigit(str.charAt(j))) {
      j--;
    }

    // Compare the characters at the left and right pointers after converting to lowercase
    if (str.charAt(i).toLowerCase() !== str.charAt(j).toLowerCase()) {
      return false; // Return false if characters don't match
    }

    i++; // Move the left pointer to the right
    j--; // Move the right pointer to the left
  }

  return true; // Return true if all characters match
}

function isLetterOrDigit(character: string): boolean {
  const charCode = character.charCodeAt(0);
  return (
    (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0)) || // Check if character is a lowercase letter
    (charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0)) || // Check if character is an uppercase letter
    (charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0)) // Check if character is a digit
  );
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each character in the string is processed once.
- **Space complexity: O(1)**. The two-pointer approach uses constant extra space for variables.

## Exercises

### Check your understanding 1

A candidate returns false whenever filtering removes every character. What should happen for the allowed input `"!? "`?

- [ ] Return false because the original punctuation is not symmetric.
  > The contract ignores punctuation and spaces before comparing.
- [ ] Reject the input because the normalized string is empty.
  > The nonempty-input constraint applies to the original string, which is valid here.
- [x] Return true because the normalized sequence is empty and equals its reverse.
  > There are no surviving character pairs that disagree, so the palindrome condition holds.
- [ ] Compare the space against the punctuation to decide.
  > Neither spaces nor punctuation are alphanumeric, so none participates in the comparison.

### Check your understanding 2

Which string is a palindrome after discarding non-alphanumeric characters and ignoring letter case?

- [ ] `Race a car`
  > Normalization produces `raceacar`, whose mirrored characters do not all match.
- [ ] `0P`
  > Both characters remain after normalization, and the digit `0` does not match the letter `p`.
- [x] `A1!1a`
  > Normalization produces `a11a`, which reads identically from both directions.
- [ ] `ab#ca`
  > Removing `#` produces `abca`, whose inner characters `b` and `c` differ.
