# Find Words in Grid

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** Matrix, Trees, Trie

> Source: [grid-find-words](https://www.greatfrontend.com/questions/algo/grid-find-words)

Given a grid of characters `grid` with dimensions `m x n` and a list of strings, `words`, find all the words present on the grid.

The word can be formed by traveling through adjacent cells, where adjacent cells are those directly next to each other either horizontally or vertically. Each cell in the grid can only be used once for forming the word.

The result can be returned in any order.

### Input

- `grid: string[][]`: A 2D array of size `m x n`, where each element is a lowercase English letter
- `words: string[]`: A list of strings to be searched for in the grid

| Input                                                                                                                                                                                                      | Output                | Explanation                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `grid = [["e","e","d","f","a","e"],["b","f","f","b","a","a"],["c","e","f","e","e","d"],["d","d","c","f","c","d"],["a","e","f","e","d","d"],["f","f","e","b","d","c"]], words = ["acd","cbbc","fb","efdc"]` | `["fb"]`              | The word 'fb' can be formed from adjacent cells on the grid, while others cannot. |
| `grid = [["a","b","c"],["s","f","c"],["d","a","f"]], words = ["abc","bcd","cfa","sfa"]`                                                                                                                    | `["abc","cfa","sfa"]` | The words 'abc', 'cfa', and 'sfa' can be formed from adjacent cells on the grid.  |
| `grid = [["x","y","z"],["a","b","c"],["d","e","f"]], words = ["xyz","abc","def","xzy"]`                                                                                                                    | `["xyz","abc","def"]` | The words 'xyz', 'abc', and 'def' can be formed from adjacent cells on the grid.  |

### Constraints

- `m == grid.length`
- `n = grid[i].length`
- 1 <= `m`, `n` <= 12
- 1 <= `words.length` <= 1,000
- 1 <= `words[i].length` <= 10
- Both `grid` and `words[i]` consist only of lowercase English letters
- Each word in the `words` list is unique

## Hints

### Where do different word searches repeat work?

`CAR`, `CARD`, and `CAT` can all begin with the same path through the grid. Three independent searches would rediscover that path.

### When can a path be abandoned?

A path that is no longer a prefix of any word cannot lead to a result.

### How should a cell's availability change during a search?

One word cannot reuse a cell, but a different path can. The visited state belongs to the current path, not to the whole search.

### How can words with the same prefix share work?

A trie stores the shared `CA` prefix once for `CAR`, `CARD`, and `CAT`. The same structure can reject a grid path that matches no prefix.

## Starter code

**TypeScript**

```ts
// Main function to find words in the board
export default function findWordsInGrid(
  grid: string[][],
  words: string[],
): string[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string[][]} grid
 * @param {string[]} words
 * @return {string[]}
 */
export default function findWordsInGrid(grid, words) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Backtracking with tries

The task is to find all words from a given list (`words`) that exist in a 2D grid. Words can be formed by sequentially adjacent cells moving up, down, left, or right. Each cell can only be used once per word.

This solution uses a trie (prefix tree) combined with backtracking for efficient word lookup and validation. The trie allows fast prefix matching, enabling the algorithm to abandon invalid paths early. Each word from the list is stored in the trie, with each path representing a possible word. During backtracking, the algorithm explores all possible paths starting from each grid cell, checking against the trie to verify valid prefixes. Words are recorded when a complete word in the trie is matched.

Words with a shared trie prefix reuse the same grid search until their prefixes diverge. Abandon a path when it no longer matches a trie prefix.

#### Algorithm

1. Construct a trie to store the given `words`:

- Initialize the trie with a root node.
- For each word in `words`, traverse the trie, adding a new node for each character if it doesn't already exist.
- Mark the end of each word in the trie by storing the word in the corresponding node.

2. Define a `backtracking` function to explore paths in the grid:

- Check if the current node in the trie represents a complete word. If so, add the word to the result list and mark it as used to avoid duplicates.
- Temporarily mark the current grid cell as visited by changing its value.
- Explore all adjacent cells (up, down, left, right) and recursively call the `backtracking` function if the corresponding character exists in the trie.
- Restore the grid cell's value after exploring all neighbors.
- Remove leaf nodes from the trie for optimization if no further paths are possible.

3. Iterate through each cell in the grid:

- If the cell's character exists as a child of the root node in the trie, initiate a backtracking search from that cell.

4. Return the list of matched words.

```ts
class TrieNode {
  // Map to hold child nodes
  children: Map<string, TrieNode> = new Map();
  // To store the word at the end of the Trie path
  word: string = "";

  constructor() {}
}

// Helper function to perform backtracking on the grid
function backtracking(
  row: number,
  col: number,
  board: string[][],
  parent: TrieNode,
  result: string[],
) {
  const letter = board[row][col];
  const currNode = parent.children.get(letter)!;

  // Check if the current node represents a word
  if (currNode.word !== "") {
    result.push(currNode.word);
    currNode.word = ""; // Prevent duplicate entries
  }

  // Mark the current cell as visited
  board[row][col] = "#";

  // Explore neighboring cells: up, right, down, left
  const rowOffset = [-1, 0, 1, 0];
  const colOffset = [0, 1, 0, -1];
  for (let i = 0; i < 4; i++) {
    const newRow = row + rowOffset[i];
    const newCol = col + colOffset[i];
    if (
      newRow < 0 ||
      newRow >= board.length ||
      newCol < 0 ||
      newCol >= board[0].length
    ) {
      continue;
    }
    if (currNode.children.has(board[newRow][newCol])) {
      backtracking(newRow, newCol, board, currNode, result);
    }
  }

  // Restore the original letter in the board
  board[row][col] = letter;

  // Optimization: remove leaf nodes
  if (currNode.children.size === 0) {
    parent.children.delete(letter);
  }
}

// Main function to find words in the grid
export default function findWordsInGrid(
  grid: string[][],
  words: string[],
): string[] {
  // Step 1: Construct the Trie
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (const letter of word) {
      if (!node.children.has(letter)) {
        node.children.set(letter, new TrieNode());
      }
      node = node.children.get(letter)!;
    }
    node.word = word; // Store words in Trie
  }

  const result: string[] = [];

  // Step 2: Backtracking starting from each cell in the grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (root.children.has(grid[row][col])) {
        backtracking(row, col, grid, root, result);
      }
    }
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(m.n.4.3l-1)**. The algorithm iterates over all `m.n` cells, exploring up to 4.3l-1 paths per cell in the worst case. This occurs when all paths are valid, such as a board filled with the same letter and a dictionary containing a single long word. Optimizations like removing matched nodes from the trie can reduce backtracking costs once all words are found.
- **Space complexity: O(l)**, where `l` is the total number of letters in the dictionary. The trie uses `l` space, or `2.l` if the words are also stored. In the worst case, each letter has its own node due to no shared prefixes.

## Exercises

### Check your understanding 1

The board search restores a cell after backtracking but permanently clears a trie terminal after reporting its word. Why are these two kinds of state allowed to have different lifetimes? Assume each dictionary word should appear once in the result.

**Answer**

A board-cell mark belongs to one candidate path; later paths may need that cell for another word, so it must be restored. A reported-word marker belongs to the whole search: once the word is in the result, finding it again adds no new answer. Clearing the terminal prevents duplicates, while keeping its children preserves any longer words that still need to be found.

**Checklist**

- Distinguishes path-local cell availability from search-wide reporting state.
- Connects permanent terminal clearing to unique output.
- Preserves descendants for longer words.

### Check your understanding 2

A board contains one row, `o a t h`, and the dictionary is `["oa", "oat", "oath", "hat"]`. Which set of words should be returned? Result order does not matter.

- [ ] `{"oath"}`
  > Reaching `oa` and `oat` completes those words even though the same path can continue to the longer word `oath`.
- [ ] `{"oa", "oat", "oath", "hat"}`
  > Starting at `h` cannot reach `a` directly because `t` lies between them, so `hat` has no valid adjacent path.
- [x] `{"oa", "oat", "oath"}`
  > Moving left to right forms all three shared-prefix words, and each terminal can be recorded before traversal continues.
- [ ] `{"oa"}`
  > Finding the shorter word does not end the search because its trie node can have children leading to `oat` and `oath`.
