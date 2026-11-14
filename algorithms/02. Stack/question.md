# Stack

**Difficulty:** Easy · **Duration:** ~10 min · **Topics:** Stack

> Source: [stack](https://www.greatfrontend.com/questions/algo/stack)

Implement a stack data structure in JavaScript that contains the following operations:

- `new Stack()`: Creates an instance of a `Stack` class that doesn't contain any items. The constructor does not accept any arguments.
- `push()`: Pushes an item onto the top of the stack and returns the new length of the stack. Required time complexity: O(1).
- `pop()`: Removes and returns the item at the top of the stack, or returns `undefined` if the stack is empty. Required time complexity: O(1).
- `isEmpty()`: Determines if the stack is empty. Required time complexity: O(1).
- `peek()`: Returns the item at the top of the stack without removing it, or returns `undefined` if the stack is empty. Required time complexity: O(1).
- `length()`: Returns the number of items in the stack. Required time complexity: O(1).

### Examples

```js
const stack = new Stack();
stack.isEmpty(); // true
stack.push(1);
stack.push(2);
stack.length(); // 2
stack.push(3);
stack.peek(); // 3
stack.pop(); // 3
stack.isEmpty(); // false
```

## Hints

### Which end matches LIFO order?

Trace pushes of `1` and `2`, followed by a pop. Which end of an array lets the newest item be read or removed in O(1), and what should those operations do when that end is empty?

## Starter code

**TypeScript**

```ts
export default class Stack<T> {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Pushes an item onto the top of the stack.
   */
  push(item: T): number {
    throw new Error("Not implemented!");
  }

  /**
   * Remove an item at the top of the stack.
   */
  pop(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Determines if the stack is empty.
   */
  isEmpty(): boolean {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the top of the stack without removing it from the stack.
   */
  peek(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the number of items in the stack.
   */
  length(): number {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class Stack {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Pushes an item onto the top of the stack.
   * @param {*} item The item to be pushed onto the stack.
   * @return {number} The new length of the stack.
   */
  push(item) {
    throw new Error("Not implemented!");
  }

  /**
   * Remove an item at the top of the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  pop() {
    throw new Error("Not implemented!");
  }

  /**
   * Determines if the stack is empty.
   * @return {boolean} `true` if the stack has no items, `false` otherwise.
   */
  isEmpty() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the top of the stack without removing it from the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  peek() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the number of items in the stack.
   * @return {number} The number of items in the stack.
   */
  length() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

#### Array-based solution

The stack abstract data type can be easily implemented in JavaScript with JavaScript `Array`s. The main thing to note when implementing stacks is that the operations should be O(1). Thankfully, JavaScript `Array`'s `push()` and `pop()` operations are O(1) and the method signatures match the `Stack`'s. Many of the methods are just simple wrappers around `Array` methods.

**JavaScript**

```js
export default class Stack {
  constructor() {
    this._items = [];
  }

  /**
   * Pushes an item onto the top of the stack.
   * @param {*} item The item to be pushed onto the stack.
   * @return {number} The new length of the stack.
   */
  push(item) {
    return this._items.push(item);
  }

  /**
   * Remove an item at the top of the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  pop() {
    return this._items.pop();
  }

  /**
   * Determines if the stack is empty.
   * @return {boolean} `true` if the stack has no items, `false` otherwise.
   */
  isEmpty() {
    return this.length() === 0;
  }

  /**
   * Returns the item at the top of the stack without removing it from the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  peek() {
    return this.isEmpty() ? undefined : this._items[this.length() - 1];
  }

  /**
   * Returns the number of items in the stack.
   * @return {number} The number of items in the stack.
   */
  length() {
    return this._items.length;
  }
}
```

**TypeScript**

```ts
export default class Stack<T> {
  _items: Array<T>;

  constructor() {
    this._items = [];
  }

  /**
   * Pushes an item onto the top of the stack.
   */
  push(item: T): number {
    return this._items.push(item);
  }

  /**
   * Remove an item at the top of the stack.
   */
  pop(): T | undefined {
    return this._items.pop();
  }

  /**
   * Determines if the stack is empty.
   */
  isEmpty(): boolean {
    return this.length() === 0;
  }

  /**
   * Returns the item at the top of the stack without removing it from the stack.
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this._items[this.length() - 1];
  }

  /**
   * Returns the number of items in the stack.
   */
  length(): number {
    return this._items.length;
  }
}
```

#### Linked list-based solution

Stacks can also be implemented with singly-linked lists which are essentially a chain of connected nodes. To do that, we need to create a `Node` class that has a `prev` pointer, a reference to the `Node` below if it's not the bottom item of the stack.

`push()`-ing involves creating a new `Node` and pointing the current top of the stack to that new `Node`'s `prev` field and updating a reference to the new top of the stack. `pop()`-ing is the reverse where we find the `prev` node of the current top and set it to be the new top of the stack.

Since the time complexity of `length()` has to be O(1) and counting the number of items in a linked list will take O(n), we need to separately track the number of items in the list with a `_length` instance property and update it within the `push()` and `pop()` methods.

```js
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
  }
}

export default class Stack {
  constructor() {
    this._top = null;
    this._length = 0;
  }

  /**
   * Pushes an item onto the top of the stack.
   * @param {*} item The item to be pushed onto the stack.
   * @return {number} The new length of the stack.
   */
  push(item) {
    const node = new Node(item);
    node.prev = this._top;
    this._top = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item at the top of the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._top;
    this._top = node.prev;
    node.prev = null;
    this._length--;
    return node.value;
  }

  /**
   * Determines if the stack is empty.
   * @return {boolean} `true` if the stack has no items, `false` otherwise.
   */
  isEmpty() {
    return this._length === 0;
  }

  /**
   * Returns the item at the top of the stack without removing it from the stack.
   * @return {*} The item at the top of the stack if it is not empty, `undefined` otherwise.
   */
  peek() {
    return this.isEmpty() ? undefined : this._top.value;
  }

  /**
   * Returns the number of items in the stack.
   * @return {number} The number of items in the stack.
   */
  length() {
    return this._length;
  }
}
```

### Edge cases

- Calling `pop()` on empty stacks.
- Calling `peek()` on empty stacks.

### Techniques

- Familiarity with JavaScript arrays.
- Object-oriented programming.

## Exercises

### Check your understanding 1

A stack determines emptiness using `!this.peek()`. Which allowed pushed values show that this confuses a stored item with an empty stack? Select all that apply.

- [x] `0`
  > A present zero is falsy, so the expression incorrectly reports empty.
- [ ] `7`
  > A positive number is truthy, so this particular value masks the faulty test.
- [x] `false`
  > The API accepts items rather than only truthy values. A false item still contributes one to the stack length.
- [ ] `-1`
  > Negative nonzero numbers are truthy in JavaScript; negativity is not the issue.

### Check your understanding 2

A candidate implements `peek()` by calling `pop()`. Which sequence distinguishes it from the required behavior without relying on internal fields?

- [ ] Peek at an empty stack and expect undefined.
  > Both peek and pop return undefined on an empty stack, so this alone does not distinguish them.
- [ ] Push 4, then pop and expect 4.
  > The faulty peek method is never called.
- [ ] Push 4 and check only that peek returns 4.
  > A destructive peek returns the right value on its first call; the lost state remains unobserved.
- [x] Push 4; peek twice; then pop. Expect 4 from all three calls.
  > Peeking must preserve the top. A pop-based peek consumes 4 on the first read, so later operations expose the mutation.

## Asked at these companies

- Amazon
