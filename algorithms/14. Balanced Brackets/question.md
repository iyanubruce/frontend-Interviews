# Balanced Brackets

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** Arrays, Stack

> Source: [array-balanced-brackets](https://www.greatfrontend.com/questions/algo/array-balanced-brackets)

Given a string `str` consisting of characters such as `'(', ')', '{', '}', '[' and ']'`, determine if the input string is properly balanced.

A string is considered balanced if:

- Each opening bracket is closed by the same type of bracket (e.g., `(` with `)`, `{` with `}`, and `[` with `]`)
- Open brackets are closed in the correct order (e.g., `([])` is valid, but `([)]` is not)
- Any subset of brackets enclosed within a matched pair must also form a valid matched pair (e.g., `{[(])}` is not balanced because the contents inside `{` and `}` are unbalanced)

### Input

- `str: string`: A string

| Input            | Output  | Explanation                                                               |
| ---------------- | ------- | ------------------------------------------------------------------------- |
| `str = "[]"`     | `true`  | The string contains correctly paired and ordered parentheses.             |
| `str = "([)]"`   | `false` | The string contains correctly paired but incorrectly ordered parentheses. |
| `str = "([]){}"` | `true`  | The string contains correctly paired and ordered parentheses.             |

### Constraints

- 1 <= `str.length` <= 1,024
- The string `str` contains only the characters `(`, `)`, `{`, `}`, `[` and `]`

## Hints

### Which opening bracket should a closer match?

In `([)]`, the counts look right but the order does not. Each closing bracket has to match the latest opening bracket that is still waiting to be closed.

### What must be true after the final character?

`((` never encounters a mismatched closing bracket, but it is not balanced.

## Starter code

**TypeScript**

```ts
export default function isBalancedBrackets(str: string): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str
 * @return {boolean}
 */
export default function isBalancedBrackets(str) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Stack

The balanced brackets problem involves determining whether a string containing brackets is valid. A string is valid if:

1. Every opening bracket has a corresponding and correctly ordered closing bracket.
2. Brackets are properly nested.

A stack data structure is ideal for solving this problem because of its LIFO (Last In First Out) nature. As the string is traversed:

1. Opening brackets are pushed onto the stack.
2. Closing brackets are matched with the top element of the stack, and the top element is popped if there is a match.

A stack validates the string in one pass, using constant-time push and pop operations. Repeatedly scanning for matching brackets can take O(n2) time.

#### Algorithm

1. Define a mapping object `mappings` where each closing bracket maps to its corresponding opening bracket.
2. Initialize an empty stack to store opening brackets during traversal.
3. Iterate through each character in the input string:

- If the character is a closing bracket:
  - Pop the top element from the stack (use a placeholder if the stack is empty).
  - Check if the popped element matches the opening bracket corresponding to the current closing bracket:
    - If not, return `false`.
- If the character is an opening bracket, push it onto the stack.

4. After processing all characters, check if the stack is empty. If it is not empty, return `false`; otherwise, return `true`.

```ts
export default function isBalancedBrackets(str: string): boolean {
  // Define a mapping from closing parentheses to their corresponding opening parentheses
  const mappings: { [key: string]: string } = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  // Initialize an empty stack to keep track of opening parentheses
  const stack: string[] = [];

  // Iterate through each character in the string
  for (let c of str) {
    // If the current character is a closing parenthesis
    if (mappings[c]) {
      // Pop the top element from the stack (or use '#' if the stack is empty)
      const topElement = stack.length ? stack.pop() : "#";

      // If the popped element does not match the corresponding opening parenthesis, return false
      if (topElement !== mappings[c]) {
        return false;
      }
    } else {
      // If the current character is an opening parenthesis, push it onto the stack
      stack.push(c);
    }
  }

  // After processing all characters, the stack should be empty for the string to be valid
  return stack.length === 0;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm processes each character in the input string exactly once, where `n` is the length of the string.
- **Space complexity: O(n)**. In the worst case, all opening brackets are stored in the stack, leading to O(n) space usage.

## Exercises

### Check your understanding 1

A bracket scanner has processed `([` and reads `)` next. What should it do?

- [x] Reject the string because `)` does not match the most recent unclosed bracket, `[`.
  > A closing bracket must match the top of the stack. Matching an older `(` would violate the required nesting order.
- [ ] Remove the earlier `(` from the stack and continue scanning.
  > Searching below the top of the stack would allow brackets to close out of order, incorrectly accepting sequences such as `([)]`.
- [ ] Push `)` onto the stack so it can be matched later.
  > Closing brackets resolve an existing opening bracket; they cannot become an unfinished opening bracket themselves.
- [ ] Continue scanning and decide only after comparing the total counts of each bracket type.
  > Equal counts do not preserve nesting order, so a final count cannot detect this mismatch reliably.

### Check your understanding 2

A bracket validator rejects a closing bracket whenever it does not match the stack top. After the loop, it returns `true` unconditionally. Which test isolates the missing final check?

- [ ] `([)]`
  > This fails during the scan because `)` does not match `[`, even without a final check.
- [x] `(()`
  > The only closing bracket matches, so execution reaches the faulty return with one opening bracket still on the stack.
- [ ] `)(`
  > The first closing bracket already fails the stack-top check.
- [ ] `(())`
  > The stack is empty at the end, so both the faulty and correct validators accept this input.

## Asked at these companies

- Kayak
