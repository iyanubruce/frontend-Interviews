# Segment Words

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** String, Dynamic programming, Graph

> Source: [string-segment-words](https://www.greatfrontend.com/questions/algo/string-segment-words)

Given a string `str` and a list of words `dict`, determine if `str` can be segmented into a sequence of one or more words from `dict`. Words from `dict` can be reused multiple times in the segmentation.

Return `true` if it is possible to segment `str`, and `false` otherwise.

### Input

- `str: string`: A string representing the string to be segmented
- `dict: string[]`: An array of strings representing the dictionary of available words

### Notes

- Words from `dict` can be used multiple times in the segmentation

| Input                                                     | Output  | Explanation                                                                             |
| --------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `str = "greatfrontendgreat", dict = ["frontend","great"]` | `true`  | The string can be segmented as 'great' + 'frontend' + 'great' as we can re-use 'great'. |
| `str = "abcd", dict = ["a","abc","b","cd"]`               | `true`  | The string can be segmented as 'a' + 'b' + 'cd'.                                        |
| `str = "a", dict = ["b"]`                                 | `false` | The single character 'a' is not in the word dictionary.                                 |

### Constraints

- 1 <= `str.length` <= 300
- 0 <= `dict.length` <= 300
- 0 <= `dict[i].length` <= 300
- `str` and `dict[i]` consist of only lowercase English letters

## Hints

### What does a cut position tell you?

At each possible boundary in `catsanddog`, record whether the prefix before it can be segmented. Full segmentations are unnecessary if that fact tells you whether another word may start there.

### How can one valid cut lead to another?

From a boundary whose prefix works, compare the following characters with the dictionary entries. Which later boundaries become possible, and what should be true at position `0` to start the process?

## Starter code

**TypeScript**

```ts
export default function segmentWords(str: string, dict: string[]): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @param {string[]} dict
 * @return {boolean}
 */
export default function segmentWords(str, dict) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Dynamic Programming

The dynamic programming approach solves the problem of segmenting a string into words from a given dictionary by breaking it into smaller subproblems. The key intuition is that if a prefix of the string can be segmented and the remaining substring exists in the dictionary, then the entire string can be segmented. A `dp` array is used to store whether a substring ending at each position can be segmented.

The `dp[i]` represents whether the substring `str[0...i-1]` can be segmented into valid words from the dictionary. This method ensures that overlapping subproblems are solved only once, avoiding redundant computations.

#### Algorithm

1. Convert the word dictionary into a `Set` for fast lookup of words.
2. Create a `dp` array of size `str.length + 1` initialized to `false`.

- Set `dp[0]` to `true` because an empty string can always be segmented.

3. Iterate through the string to check substrings ending at each position `end`:

- For each `end`, iterate through possible starting positions `start` of substrings.
- Check if the substring `str[start...end-1]` exists in the dictionary and if `dp[start]` is `true`.
- If both conditions are satisfied, set `dp[end]` to `true` and break the inner loop.

4. Return the value of `dp[str.length]`, which indicates whether the entire string can be segmented.

```ts
export default function segmentWords(str: string, dict: string[]): boolean {
  // Create a set from the word dictionary for quick lookup
  const dictSet = new Set(dict);

  // Create a DP array initialized to false, with an extra space for the base case
  const dp: boolean[] = new Array(str.length + 1).fill(false);
  dp[0] = true; // Base case: an empty string can always be segmented

  // Iterate over the end positions of the substring
  for (let end = 1; end <= str.length; end++) {
    // Iterate over the start positions of the substring
    for (let start = 0; start < end; start++) {
      // If the substring from start to end can be segmented
      if (dp[start] && dictSet.has(str.substring(start, end))) {
        dp[end] = true; // Mark the end position as true
        break; // No need to check further start positions for this end
      }
    }
  }

  // The last element in dp represents whether the entire string can be segmented
  return dp[str.length];
}
```

#### Big-O analysis

- **Time complexity: O(n.m.k)**. Calculating whether the substring exists in the dictionary costs O(m.k), where `m` is the size of the dictionary and `k` is the average word length. Since there are O(n) states to calculate, the total time complexity is O(n.m.k).
- **Space complexity: O(n)**. The `dp` array requires O(n) space.

### 2. Using BFS

The breadth-first search (BFS) approach solves the string segmentation problem by exploring all possible segmentations as levels in a graph. The key intuition is that the problem can be represented as navigating from the start to the end of the string, where each valid substring corresponds to an edge connecting two nodes (indices). A queue is used to perform BFS, starting from index `0`, and exploring all possible substrings that exist in the dictionary.

The use of BFS ensures that the solution checks all valid paths systematically. To prevent redundant computations, a `seen` set is used to track already visited indices.

#### Algorithm

1. Convert the dictionary `dict` into a `Set` for O(1) average time complexity lookups.
2. Check the base case where the string is empty. If the string is empty, return `true`.
3. Initialize a queue with the starting index `0` and a `seen` set to track visited indices.
4. Perform BFS:

- Dequeue the front element of the queue, representing the current starting index.
- If the starting index equals the length of the string, return `true`, as the string can be segmented.
- Iterate over all possible ending indices from `start + 1` to `str.length`:
  - Skip indices that are already in the `seen` set.
  - If the substring from `start` to `end` exists in the dictionary:
    - Add the `end` index to the queue.
    - Mark the `end` index as visited in the `seen` set.

5. If the queue is exhausted and no valid segmentation is found, return `false`.

```ts
export default function segmentWords(str: string, dict: string[]): boolean {
  // Convert dict to a set for O(1) average time complexity lookups
  const words = new Set(dict);

  // Check for empty string as a base case
  if (str.length === 0) return true;

  // Initialize variables
  const queue: number[] = [0];
  const seen = new Set<number>();

  // Breadth-first search loop
  while (queue.length !== 0) {
    // Check if queue is empty before dequeueing
    if (queue.length === 0) return false; // String cannot be formed from words

    const start = queue.shift()!; // Use non-null assertion after the check

    // If we reached the end of the string, return true
    if (start === str.length) return true;

    // Iterate over all possible end indices from start + 1 to end of string
    for (let end = start + 1; end <= str.length; end++) {
      // Skip already processed end indices
      if (seen.has(end)) continue;

      // Check if substring from start to end exists in dict
      if (words.has(str.substring(start, end))) {
        // If found, enqueue the end index and mark as visited
        queue.push(end);
        seen.add(end);
      }
    }
  }

  // If no segmentation found, return false
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n3 + m⋅k)**. There are O(n) nodes, and each node is visited at most once due to the `seen` set. At each node, the algorithm iterates over the nodes in front of the current node (O(n)) and creates substrings (O(n)), resulting in O(n2) per node. Thus, the BFS costs O(n3). Additionally, creating the `words` set from the dictionary costs O(m⋅k), where `m` is the size of the dictionary and `k` is the average word length.
- **Space complexity: O(n + m⋅k)**. The `queue` and `seen` set require O(n) space, while the `words` set requires O(m⋅k) space.

## Exercises

### Check your understanding 1

The constraints allow an empty string in `dict`. A recursive variant tries every matching dictionary word and recurses after its length. What happens when it tries `""`? Explain why ignoring empty dictionary entries is safe for this nonempty-input, boolean decision problem.

**Answer**

An empty word matches at the current cut but advances by zero characters, so the recursive call repeats the same state and can recurse forever before making progress. Removing empty words does not change whether a nonempty input can be segmented: deleting empty pieces from any successful segmentation leaves the same concatenated string. Only positive-length matches need to create transitions to later cuts. This reasoning concerns existence; a variant counting segmentations would need to define how empty pieces are treated.

**Checklist**

- Identify the zero-length self-transition and its effect on recursion.
- Show why removing empty pieces preserves a successful nonempty concatenation.
- Require every recursive transition to advance the cut.

### Check your understanding 2

Given the string `cars` and reusable dictionary words `['car', 'ca', 'rs']`, which conclusion is correct?

- [x] Segmentation succeeds as `ca | rs`.
  > The cut after `ca` is reachable and the remaining substring `rs` is also a dictionary word, so the full string is covered.
- [ ] Segmentation fails because choosing `car` leaves `s`, which is not a dictionary word.
  > The algorithm considers alternative reachable cuts, so the dead end after `car` does not invalidate the successful `ca | rs` path.
- [ ] Segmentation succeeds only if `cars` itself is added to the dictionary.
  > Multiple dictionary words may be concatenated, and `ca | rs` already forms the full string without a whole-string entry.
- [ ] Segmentation fails because a valid result may use only one dictionary word.
  > The problem explicitly permits a sequence of reusable dictionary words, so using two words is valid.
