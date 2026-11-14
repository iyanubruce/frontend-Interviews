# Extraterrestrial Language

**Difficulty:** Hard · **Duration:** ~55 min · **Topics:** Graph, Topological sort

> Source: [extraterrestrial-language](https://www.greatfrontend.com/questions/algo/extraterrestrial-language)

An extraterrestrial language uses the English alphabet, but the letter order is unknown. A list of strings `words` is provided, which represents words from the extraterrestrial language's dictionary, and it is claimed that these words are sorted according to the new language's [lexicographical order](https://en.wikipedia.org/wiki/Lexicographic_order).

If this claim is false, and the arrangement of strings in `words` cannot match any possible letter order, return an empty string. Otherwise, return a string containing the unique letters of the extraterrestrial language sorted according to the language's rules. If multiple valid solutions exist, any of them are acceptable.

### Input

- `words: string[]`: An array of strings where each string is a word in the extraterrestrial language

| Input                         | Output  | Explanation                                                                                                                                                                                                                                              |
| ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `words = ["cab","abc","bca"]` | `"cab"` | Comparing 'cab' and 'abc', the first differing characters are c and a, suggesting c comes before a. Comparing 'abc' and 'bca', the first differing characters are a and b, so a comes before b. Thus, the order of letters in the new alphabet is 'cab'. |
| `words = ["abc","ab"]`        | `""`    | The list is invalid because 'abc' cannot come before its exact prefix 'ab'. A shorter word with the same prefix cannot appear after a longer word, so the sequence is impossible, and the result is an empty string.                                     |
| `words = ["z","x","z"]`       | `""`    | The sequence is invalid because 'z' appears both before and after 'x', which creates a contradiction in the order. This inconsistency makes it impossible to deduce a valid letter order, so the result is an empty string.                              |

### Constraints

- 1 <= `words.length` <= 100
- 1 <= `words[i].length` <= 100
- `words[i]` consists of only lowercase English letters

## Hints

### Which letters does a pair of words compare?

For two neighboring words, only their first different characters establish an ordering rule. Anything after that point cannot affect which word comes first.

### When does a prefix make the list impossible?

Compare `"abcd"` followed by `"ab"`. No alphabet order can place the longer word first when every character of the shorter word already matches.

### How can the letter rules become one order?

Treat each rule as a dependency between letters, including letters with no dependencies. Repeatedly choose an available letter; if some letters never become available, the rules contain a cycle.

## Starter code

**TypeScript**

```ts
export default function extraterrestrialLanguage(words: string[]): string {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string[]} words
 * @return {string}
 */
export default function extraterrestrialLanguage(words) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using BFS

The problem is to determine the order of characters in an extraterrestrial language based on a list of words sorted in lexicographical order. This involves inferring a directed acyclic graph (DAG) from the given words and performing a topological sort on it.

The algorithm:

- Builds a graph where nodes represent unique characters and directed edges indicate character precedence.
- Uses Breadth-First Search (BFS) to perform a topological sort of the graph.
- Handles invalid cases such as prefix conflicts or cycles in the graph.

#### Algorithm

1. Initialize an adjacency list `adjList` to represent the graph and a `counts` map to track in-degrees of each character.

- Add all unique characters to both `adjList` and `counts`.

2. Iterate through the list of words to establish precedence relationships:

- Compare adjacent words `word1` and `word2`.
- Check for invalid cases where `word2` is a prefix of `word1` but shorter.
- For the first differing character between `word1` and `word2`, add a directed edge in `adjList` and increment the in-degree in `counts`.

3. Use BFS to perform a topological sort:

- Add all characters with zero in-degree to a queue.
- Process each character from the queue:
  - Append it to the result string.
  - Decrease the in-degree of its neighbors and enqueue any neighbor whose in-degree becomes zero.

4. Check if the resulting string contains all unique characters. If not, a cycle exists, and the result is invalid.
5. Return the resulting string if valid, otherwise return an empty string.

```ts
export default function extraterrestrialLanguage(words: string[]): string {
  // Step 0: Create data structures and find all unique letters.
  const adjList: { [key: string]: string[] } = {};
  const counts: { [key: string]: number } = {};

  // Initialize the adjacency list and the counts map
  for (const word of words) {
    for (const c of word) {
      if (!counts[c]) {
        counts[c] = 0;
        adjList[c] = [];
      }
    }
  }

  // Step 1: Find all edges.
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];

    // Check that word2 is not a prefix of word1.
    if (word1.length > word2.length && word1.startsWith(word2)) {
      return "";
    }

    // Find the first non-match and insert the corresponding relation.
    for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
      if (word1[j] !== word2[j]) {
        adjList[word1[j]].push(word2[j]);
        counts[word2[j]]++;
        break;
      }
    }
  }

  // Step 2: Breadth-first search.
  const sb: string[] = [];
  const queue: string[] = [];

  // Enqueue characters with no incoming edges (counts[c] === 0)
  for (const c in counts) {
    if (counts[c] === 0) {
      queue.push(c);
    }
  }

  // Perform BFS to build the result string
  while (queue.length > 0) {
    const c = queue.shift()!;
    sb.push(c);
    for (const next of adjList[c]) {
      counts[next]--;
      if (counts[next] === 0) {
        queue.push(next);
      }
    }
  }

  // If the result length is less than the number of unique characters, return an empty string
  if (sb.length < Object.keys(counts).length) {
    return "";
  }

  return sb.join("");
}
```

#### Big-O analysis

- **Time complexity: O(n + m)**. Processing all characters takes O(m), where `m` is the total number of characters in the input. Building edges and performing BFS takes O(n + m), where `n` is the number of unique characters.
- **Space complexity: O(n + m)**. The adjacency list and in-degree map require O(n + m) space.

## Exercises

### Check your understanding 1

A topological-sort implementation sees no letter-precedence edges for `words = ["abc", "ab"]` and therefore accepts it. What validation is missing?

- [ ] It should order `a`, `b`, and `c` by how often they occur.
  > Frequency provides no evidence about lexicographic letter precedence.
- [ ] It should add `c → b` after the shorter word ends.
  > There is no differing character at that position in the second word to compare.
- [x] It must reject a longer word appearing before its exact prefix.
  > All shared characters match. The shorter prefix must come first regardless of alphabet order, so an acyclic letter graph alone does not prove validity.

### Check your understanding 2

The claimed dictionary order is `["za", "zb", "ca", "cb"]`. Which precedence relationships are required by comparing each adjacent pair only until its first mismatch?

- [ ] `z` must precede `c`, and `b` must precede `a`.
  > The pairs `"za"`/`"zb"` and `"ca"`/`"cb"` both establish `a` before `b`, not the reverse.
- [x] `a` must precede `b`, and `z` must precede `c`.
  > The first and last comparisons establish `a → b`, while comparing `"zb"` with `"ca"` establishes `z → c` at the first character.
- [ ] `z` must precede `a`, and `c` must precede `b`.
  > Letter order comes from differences between adjacent words, not from the left-to-right character order inside one word.
- [ ] `z` must precede `c`, and `b` must precede `a` because both positions differ between `"zb"` and `"ca"`.
  > Once `z` and `c` differ, lexicographical comparison stops, so the later `b` and `a` do not create a constraint.
