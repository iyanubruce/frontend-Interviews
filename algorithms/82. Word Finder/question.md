# Word Finder

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Matrix, Graph, Trie

> Source: [word-finder](https://www.greatfrontend.com/questions/algo/word-finder)

Implement `WordFinder` class that allows for adding words and searching for them. It has the following methods:

- `addWord(word: string): void`: Adds a word to the data structure
- `search(query: string): boolean`: Returns whether an added word matches the entire query. Each dot `.` in the query matches exactly one lowercase English letter

### Input

The `WordFinder` instance will have its methods called with various parameters based on these:

- `methods: string[]`: An array of method names
- `params: string[]`: An array of strings

`methods[i]` will be called with `params[i]`.

| Input                                                                                                                                               | Output                                   | Explanation                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `methods = ["addWord","addWord","search","addWord","search","search","search"], params = ["car","cat","c.r","dog","d.g","cat","c.."]`               | `[null,null,true,null,true,true,true]`   | Words 'car' and 'cat' are added, 'c.r' matches 'car', 'dog' and 'd.g' match, 'c..' matches both 'car' and 'cat'.                                  |
| `methods = ["addWord","addWord","addWord","search","search","addWord","search"], params = ["hello","hollow","hollow","hell","hel.o","hero","h.o."]` | `[null,null,null,false,true,null,false]` | The words 'hello', 'hollow' are added, 'hell' doesn't exist, 'hel.o' matches 'hello', 'hero' is added, 'h.o.' does not match with any other word. |
| `methods = ["addWord","search","addWord","search","addWord","search","search"], params = ["bat","b.t","ball","ba.l","bat","b.ll","ball"]`           | `[null,true,null,true,null,true,true]`   | Words 'bat' and 'ball' are added, 'b.t' matches 'bat', 'ba.l', 'b.ll' and 'ball' match 'ball'.                                                    |

### Constraints

- 1 <= `word.length` <= 25
- 1 <= `methods.length` <= 1,000
- Search queries may include `.` and lowercase English letters, with at most 2 dots per query
- Each word contains only lowercase English letters

## Hints

### How can added words share storage?

Draw `bad`, `bat`, and `bag` as character-by-character paths. A prefix tree lets their common beginning share nodes while preserving the points where they differ.

### How will you recognize a complete word?

After adding only `badly`, a search for `bad` can still follow a valid path but must return `false`. What must be recorded at the end of each added word to distinguish those cases?

### What should a dot do to the search?

An exact character follows one path, but `.` may follow any child while consuming exactly one query position. For a query such as `b.d`, which alternatives need to be explored, and when may that search stop?

## Starter code

**TypeScript**

```ts
export default class WordFinder {
  addWord(word: string): void {
    throw new Error("Not implemented!");
  }

  search(word: string): boolean {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class WordFinder {
  /**
   * @param {string} word
   */
  addWord(word) {
    throw new Error("Not implemented!");
  }

  /**
   * @param {string} word
   * @returns {boolean}
   */
  search(word) {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### 1. Using tries

A `WordFinder` stores words in a trie (prefix tree). Each node has a `Map` of child nodes and a boolean flag marking the end of a word. Searches support exact characters and the `.` wildcard.

The main idea is to add words to the Trie node by node, where each character represents a path in the Trie. Searching is done recursively, with special handling for the `.` character, which acts as a wildcard. The `.` can match any character, and all possible child nodes are explored recursively to find a match.

#### Algorithm

1. **Add word**:

- Start at the root node.
- For each character in the word, check if it exists in the current node's `children` map.
- If it does not exist, create a new `TrieNode` and add it to the map.
- Move to the next node and repeat until the word is fully added.
- Mark the final node as the end of the word by setting the `word` flag to `true`.

2. **Search**:

- Use the helper function `searchInNode` to traverse the Trie recursively.
- For each character:
  - If it exists in the current node's `children`, move to the child node.
  - If the character is `.`, iterate over all children nodes and recursively search for the remaining substring.
  - If the character does not exist and is not `.`, return `false`.
- At the end of the word, return `true` if the current node marks the end of a word.

```ts
class TrieNode {
  // A map to hold child nodes
  children: Map<string, TrieNode> = new Map();
  // Indicates whether this node is the end of a word
  word: boolean = false;
}

export default class WordFinder {
  private trie: TrieNode;

  constructor() {
    // Initialize the root of the trie
    this.trie = new TrieNode();
  }

  addWord(word: string): void {
    let node = this.trie;

    for (const ch of word) {
      // If the character is not already a child node, add it
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      // Move to the next node in the trie
      node = node.children.get(ch)!;
    }
    // Mark the end of the word
    node.word = true;
  }

  private searchInNode(word: string, node: TrieNode): boolean {
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      // If the character is not found, check if it's a '.'
      if (!node.children.has(ch)) {
        if (ch === ".") {
          // Iterate over all children nodes using forEach
          let found = false;
          node.children.forEach((child) => {
            // Recursively search for the remaining substring in each child node
            if (this.searchInNode(word.substring(i + 1), child)) {
              found = true;
            }
          });
          return found;
        }
        // If the character is not a '.' and not found, return false
        return false;
      } else {
        // If the character is found, move down to the next level in the trie
        node = node.children.get(ch)!;
      }
    }
    // Return true if the current node marks the end of a word
    return node.word;
  }

  search(word: string): boolean {
    return this.searchInNode(word, this.trie);
  }
}
```

#### Big-O analysis

- **Time complexity**: O(m), for words that are clearly defined without dots, where `m` is the length of the word. For "undefined" words, the time complexity is O(n.26m), where n is the number of keys and m is the length of the undefined word. This represents the worst-case scenario when searching for an undefined word with m recursive calls, as the word is one character longer than all inserted keys.
- **Space complexity**: O(1) for the search of "well-defined" words without dots. For "undefined" words, the space complexity can go up to O(m) to accommodate the recursion stack.

## Exercises

### Check your understanding 1

Words `"bad"` and `"cat"` are added in that order. At a dot, a buggy search returns the result of trying the first child immediately, even when that result is false. Which query exposes the premature return?

- [ ] `"bad"`
  > This follows only exact links and never branches at a dot.
- [ ] `"b.d"`
  > After b, the relevant child path matches ad, so the first wildcard branch succeeds.
- [x] `".at"`
  > The b branch fails to match at, but the later c branch matches cat. A failed alternative must not prevent trying another child.
- [ ] `"c.t"`
  > The initial c selects the correct root branch directly, and its wildcard path succeeds.

### Check your understanding 2

After adding `cat`, `cart`, and `dog`, what is the result tuple for `search("c.t")`, `search("c..t")`, `search("car")`, and `search("do.")`, in that order?

- [ ] `(true, true, true, true)`
  > Although `car` is a prefix of `cart`, it was not added as a complete word and therefore cannot satisfy whole-word search.
- [x] `(true, true, false, true)`
  > The wildcard queries match `cat`, `cart`, and `dog` at their exact lengths, while the unmarked prefix `car` fails.
- [ ] `(true, false, false, false)`
  > Each dot independently matches one letter, so `c..t` matches `cart` and `do.` matches `dog`.
- [ ] `(false, false, false, false)`
  > Dots are supported wildcards rather than literal trie edges, so the three full-length patterns each have a matching branch.
