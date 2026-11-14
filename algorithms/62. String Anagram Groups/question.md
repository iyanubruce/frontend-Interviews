# String Anagram Groups

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** String

> Source: [string-anagram-groups](https://www.greatfrontend.com/questions/algo/string-anagram-groups)

Given an array of strings `strs`, group the strings that are anagrams of each other. The result can be returned in any order.

An anagram is a word or phrase formed by rearranging the letters of another word or phrase, using all the original letters exactly once.

### Input

- `strs: string[]`: An array of strings

| Input                                         | Output                                           | Explanation                                            |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `strs = ["abc","bca","cab","xyz","zyx"]`      | `[["abc","bca","cab"],["xyz","zyx"]]`            | Two anagram groups: 'abc'-'bca'-'cab' and 'xyz'-'zyx'. |
| `strs = ["rat","tar","art","car","arc"]`      | `[["arc","car"],["art","rat","tar"]]`            | Two anagram groups: 'car'-'arc' and 'rat'-'tar'-'art'. |
| `strs = ["kxac","swavb","lmq","lvhc","sjey"]` | `[["kxac"],["lmq"],["lvhc"],["sjey"],["swavb"]]` | Each word has no anagram in the list.                  |

### Constraints

- 1 <= `strs.length` <= 1,000
- 1 <= `strs[i].length` <= 100
- Each string `strs[i]` contains only lowercase English letters

## Hints

### What stays the same after rearranging?

Compare `eat`, `tea`, and `tan`. Can you give each string a representation that ignores character order but still distinguishes different character counts? Strings with the same representation can share a group.

## Starter code

**TypeScript**

```ts
export default function anagramGroups(strs: string[]): string[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
export default function anagramGroups(strs) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Sorting

Sort each string's characters to form a group key. Anagrams produce the same key, so append each original string to that key's array in a `Map`.

#### Algorithm

1. Initialize an empty `Map` to store groups of anagrams.

- The keys represent the sorted version of strings, and the values are arrays of original strings.

2. Iterate over the input array of strings.

- For each string, convert it into a character array and sort it alphabetically.
- Join the sorted characters to create a key.

3. Check if the key already exists in the `Map`.

- If the key does not exist, initialize it with an empty array.
- Append the original string to the array corresponding to the key.

4. Convert the values of the `Map` into an array of arrays and return it.

```ts
export default function anagramGroups(strs: string[]): string[][] {
  // Create a map to store the anagrams.
  // The keys are the sorted versions of the strings,
  // and the values are arrays containing the original strings (anagrams).
  let map = new Map<string, string[]>();

  // Iterate over each string in the input array
  for (let str of strs) {
    // Convert the string to a character array and sort it alphabetically
    let chars = Array.from(str);
    chars.sort();

    // Join the sorted characters to form a key
    // This key will be the same for all anagrams
    let key = chars.join("");

    // If the key doesn't exist in the map, add it with an empty array as the value
    if (!map.has(key)) map.set(key, []);

    // Add the original string to the array of anagrams for this key
    map.get(key)!.push(str);
  }

  // Convert the map's values to an array and return it.
  // Each element in the array is a group of anagrams.
  return Array.from(map.values());
}
```

#### Big-O analysis

- **Time complexity: O(n.m log m)**. Sorting each string of length `m` takes O(m log m), and there are `n` strings.
- **Space complexity: O(n.m)**. The `Map` stores all strings, and the space required for keys and values depends on the total characters in the input.

### 2. Using Frequency Count

Instead of sorting strings to generate keys like previous solution, a frequency array of fixed size (26 for the English alphabet) is used to count occurrences of each character. This solution optimizes the process by representing each string using its character frequency count. This eliminates the need for sorting, which is the bottleneck in the sorting-based approach.

The key for each group is derived from the frequency count, formatted as a concatenated string with counts of all characters. This ensures all anagrams map to the same key while avoiding sorting overhead, improving the efficiency of the solution.

#### Algorithm

1. Check if the input array is empty.

- If the array is empty, return an empty array.

2. Initialize an empty object to store groups of anagrams.

- The keys represent character count patterns, and the values are arrays of strings matching the pattern.

3. Iterate over each string in the input array.

- Initialize a count array of size 26 to represent character frequencies.
- For each character in the string, increment the corresponding index in the count array.

4. Generate a key string from the count array.

- Concatenate `#` and the count of each character to form the key.

5. Check if the key exists in the object.

- If the key does not exist, initialize it with an empty array.
- Append the string to the array corresponding to the key.

6. Return the values of the object as an array of groups of anagrams.

```ts
export default function anagramGroups(strs: string[]): string[][] {
  // If the input array is empty, return an empty array
  if (strs.length === 0) return [];

  // Initialize an object to store groups of anagrams
  // The keys are unique representations of the character counts
  // The values are arrays of strings that match the key's character count
  let ans: { [key: string]: string[] } = {};

  // Iterate over each string in the input array
  for (let s of strs) {
    // Create an array to count occurrences of each character (26 letters of the alphabet)
    let count: number[] = Array(26).fill(0);

    // Increment the corresponding index in the count array for each character in the string
    for (let c of s) count[c.charCodeAt(0) - "a".charCodeAt(0)]++;

    // Create a key string based on the character counts
    // The key is formatted as a series of "#count" for each character
    let key = "";
    for (let i = 0; i < 26; i++) {
      key += "#";
      key += count[i];
    }

    // If the key doesn't exist in the map, initialize it with an empty array
    if (!ans[key]) ans[key] = [];

    // Add the original string to the array associated with the key
    ans[key].push(s);
  }

  // Return the values of the map, which are the groups of anagrams
  return Object.values(ans);
}
```

#### Big-O analysis

- **Time complexity: O(n.m)**. Counting characters for each string of length `m` takes O(m), and there are `n` strings.
- **Space complexity: O(n.m)**. The object stores all strings, and additional space is used for character counts and keys.

## Exercises

### Check your understanding 1

A frequency-key implementation removes the `#` separators and concatenates decimal counts directly. Show how counts `(1, 11, 0, ..., 0)` and `(11, 1, 0, ..., 0)` collide even though the strings are not anagrams. Why do fixed alphabet order and equal string lengths fail to prevent this?

**Answer**

The first two counts concatenate to "111" in either case, followed by the same 24 zeros. A string with one a and eleven bs is not an anagram of one with eleven as and one b, although both lengths are 12 and the slots use the same alphabet order. Without delimiters, variable-width numbers lose their boundaries. Joining all 26 counts with a delimiter, such as "#", preserves each slot unambiguously.

**Checklist**

- Construct two distinct count vectors with identical delimiter-free serialization.
- Note that both strings can have the same total length.
- Explain how a delimiter restores the boundaries between counts.

### Check your understanding 2

For the input `["eat", "tea", "tan", "ate", "nat", "bat", "eat"]`, which grouping is correct? Group and item order do not matter.

- [ ] `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`
  > The second `eat` is a separate input occurrence and must remain in the first group rather than being deduplicated.
- [x] `[["eat", "tea", "ate", "eat"], ["tan", "nat"], ["bat"]]`
  > The four strings with signature `aet` group together, the two with signature `ant` group together, and `bat` has its own signature.
- [ ] `[["eat", "tea", "tan", "ate", "nat", "bat", "eat"]]`
  > Equal length alone does not make strings anagrams because the `aet`, `ant`, and `abt` character signatures differ.
- [ ] `[["eat", "tea"], ["ate", "eat"], ["tan", "nat"], ["bat"]]`
  > Every string with the same signature belongs in one group, so the four `aet` anagrams cannot be split across two groups.

## Asked at these companies

- Amazon
