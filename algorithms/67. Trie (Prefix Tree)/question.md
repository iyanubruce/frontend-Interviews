# Trie (Prefix Tree)

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Trees, Trie

> Source: [trie-prefix-tree](https://www.greatfrontend.com/questions/algo/trie-prefix-tree)

A [trie](https://en.wikipedia.org/wiki/Trie) (pronounced "try"), also known as a prefix tree, is a tree-like data structure designed to efficiently manage and query strings. It's particularly useful for tasks such as autocomplete and spell checking.

Implement a `Trie` class with the following methods:

- `insert(word: string): void`: Adds the given word to the `Trie`
- `search(word: string): boolean`: Checks if the specified word exists in the trie and returns `true` if it does, otherwise `false`
- `startsWith(prefix: string): boolean`: Checks if there is any word in the Trie that starts with the given prefix and returns `true` if such a word exists, otherwise `false`

### Input

The `Trie` instance will have its methods called with various parameters based on these:

- `methods: string[]`: An array of `Trie` method names
- `params: string[]`: An array of strings

`methods[i]` will be called with `params[i]`.

| Input                                                                                                                                                 | Output                     | Explanation                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `methods = ["insert","insert","search","startsWith","insert","search","startsWith"], params = ["car","care","car","cap","card","cast","car"]`         | `[null,null,1,0,null,0,1]` | The words 'car' and 'care' are inserted. 'search' for 'car' finds it, and 'startsWith' for 'cap' returns 0. 'card' is then inserted. 'search' for 'cast' does not find it. 'startsWith' finds 'car' |
| `methods = ["insert","insert","search","startsWith","insert","search","startsWith"], params = ["dog","doge","dog","do","door","doge","doc"]`          | `[null,null,1,1,null,1,0]` | Words 'dog' and 'doge' are inserted. 'search' finds 'dog' and 'startsWith' finds 'do'. After 'door' is inserted, 'search' finds 'doge'.'startsWith' do not finds 'doc'                              |
| `methods = ["insert","insert","startsWith","insert","search","search","startsWith"], params = ["banana","band","ban","bandit","band","banana","ban"]` | `[null,null,1,null,1,1,1]` | 'banana' and 'band' are inserted. 'startsWith' finds 'ban'. After 'bandit' is inserted, both 'band' and 'banana' can be found. 'startsWith' finds 'ban'.                                            |

### Constraints

- 1 <= `word.length` <= 100
- 1 <= `prefix.length` <= 100
- `word` and `prefix` contain only lowercase English letters
- 1 <= `methods.length` <= 1,000

## Hints

### How can words share their prefixes?

Draw `app`, `apple`, and `apt` one character at a time from a common starting point, marking shared path segments, branch points, and complete words.

### How is a word different from a prefix?

After inserting only `apple`, walking the path for `app` succeeds even though `search('app')` should not. What extra fact must the node at the end of an inserted word remember?

## Starter code

**TypeScript**

```ts
export default class Trie {
  public insert(word: string): void {
    throw new Error("Not implemented!");
  }

  public search(word: string): boolean {
    throw new Error("Not implemented!");
  }

  public startsWith(prefix: string): boolean {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class Trie {
  /**
   * @param {string} word
   */
  insert(word) {
    throw new Error("Not implemented!");
  }

  /**
   * @param {string} word
   * @returns {boolean}
   */
  search(word) {
    throw new Error("Not implemented!");
  }

  /**
   * @param {string} prefix
   * @returns {boolean}
   */
  startsWith(prefix) {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### 1. Using Trie data structure

A Trie (prefix tree) is a tree-like data structure used for efficient storage and retrieval of strings, particularly when working with prefixes. Each node in a Trie represents a single character and stores references to its child nodes. This structure enables fast operations such as inserting a word, searching for a word, and checking if any word starts with a given prefix.

The Trie is initialized with a root node that has links to its child nodes. Each link corresponds to a character from 'a' to 'z'. Words are inserted character by character into the Trie, creating new child nodes if a character does not exist. The search operation traverses the Trie to check if all characters of a word or prefix exist, while the `isEnd` flag at each node indicates whether the node marks the end of a word. The design efficiently handles operations involving prefixes, as shared prefixes are stored only once.

#### Algorithm

1. **Insert**:

- Start from the root node.
- For each character in the word, check if the node contains a link for the character.
- If not, create a new node and add it as a child.
- Move to the child node and repeat for all characters.
- Mark the last node as the end of a word using the `isEnd` flag.

2. **Search**:

- Traverse the Trie using the characters of the word.
- If any character is not found, the word does not exist.
- Check if the last node represents the end of a word.

3. **StartsWith**:

- Traverse the Trie using the characters of the prefix.
- If all characters are found, the prefix exists in the Trie.

```ts
class TrieNode {
  // Array to hold child nodes
  private links: TrieNode[] = [];
  private static readonly NUM_ALPHABETS = 26; // Number of possible links (a-z)
  private isEnd: boolean = false; // Indicates if this node is the end of a word

  constructor() {
    this.links = new Array(TrieNode.NUM_ALPHABETS); // Initialize the array with 26 slots
  }

  // Check if a child node for the given character exists
  public containsKey(ch: string): boolean {
    return this.links[ch.charCodeAt(0) - "a".charCodeAt(0)] !== undefined;
  }

  // Get the child node for the given character
  public get(ch: string): TrieNode | undefined {
    return this.links[ch.charCodeAt(0) - "a".charCodeAt(0)];
  }

  // Put a child node for the given character
  public put(ch: string, node: TrieNode): void {
    this.links[ch.charCodeAt(0) - "a".charCodeAt(0)] = node;
  }

  // Set this node as the end of a word
  public setEnd(): void {
    this.isEnd = true;
  }

  // Check if this node is the end of a word
  public isEndNode(): boolean {
    return this.isEnd;
  }
}

export default class Trie {
  private root: TrieNode = new TrieNode();

  constructor() {
    this.root = new TrieNode();
  }

  // Inserts a word into the trie
  public insert(word: string): void {
    let node: TrieNode = this.root;

    for (let i = 0; i < word.length; i++) {
      const currentChar: string = word.charAt(i);
      if (!node.containsKey(currentChar)) {
        node.put(currentChar, new TrieNode());
      }
      node = node.get(currentChar)!; // Non-null assertion since containsKey checks existence
    }

    node.setEnd();
  }

  // Search for the prefix or whole key in the trie
  private searchPrefix(word: string): TrieNode | null {
    let node: TrieNode = this.root;
    for (let i = 0; i < word.length; i++) {
      const curLetter: string = word.charAt(i);
      if (node.containsKey(curLetter)) {
        node = node.get(curLetter)!; // Non-null assertion since containsKey checks existence
      } else {
        return null;
      }
    }
    return node;
  }

  // Returns if the word is in the trie
  public search(word: string): boolean {
    const node: TrieNode | null = this.searchPrefix(word);
    return node !== null && node.isEndNode();
  }

  // Returns if there is any word in the trie that starts with the given prefix
  public startsWith(prefix: string): boolean {
    const node: TrieNode | null = this.searchPrefix(prefix);
    return node !== null;
  }
}
```

#### Big-O analysis

- **Time complexity**:
  - Insert: O(m), where `m` is the length of the word being inserted.
  - Search: O(m), where `m` is the length of the word being searched.
  - StartsWith: O(m), where `m` is the length of the prefix.
- **Space complexity**: O(n), where `n` is the total number of characters across all inserted words. Each character requires a node in the Trie, and shared prefixes reduce redundancy.

## Exercises

### Check your understanding 1

Extend the trie with deletion of word membership. After inserting `"car"` and `"cart"`, why is removing the node for r an incorrect way to delete `"car"`? State the safe change and the condition under which a node could actually be pruned.

**Answer**

The r node also leads to t, which represents the still-stored word cart. Deleting that node would lose cart too. Clear the terminal marker at r so search("car") becomes false while startsWith("car") and search("cart") stay true. A node can be pruned only when it is not a word ending and has no children; pruning may then continue toward the root under the same condition.

**Checklist**

- Preserve descendants that belong to longer words.
- Distinguish clearing a terminal marker from removing the path.
- Require both no word ending and no children before pruning.

### Check your understanding 2

After calling `insert("car")` and `insert("cart")`, what is the result tuple for `search("ca")`, `startsWith("ca")`, `search("car")`, and `startsWith("care")`, in that order?

- [ ] `(true, true, true, false)`
  > The path for `ca` exists but has no end-of-word marker, so `search("ca")` is `false`.
- [ ] `(false, false, true, false)`
  > `startsWith("ca")` needs only the existing prefix path and does not require `ca` itself to have been inserted.
- [ ] `(false, true, true, true)`
  > The inserted paths continue from `car` only to `t`, so no child path spells the prefix `care`.
- [x] `(false, true, true, false)`
  > `ca` is only a prefix, `car` is a marked word, and the absent `e` link makes `care` an unknown prefix.
