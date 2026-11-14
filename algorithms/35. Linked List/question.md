# Linked List

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Linked list

> Source: [linked-list](https://www.greatfrontend.com/questions/algo/linked-list)

Implement a linked list data structure in JavaScript that contains the following operations:

- `new LinkedList()`: Creates an instance of a `LinkedList` class that does not contain any items. The constructor does not accept any arguments.
- `get()`: Accepts an integer parameter `i` to return the value of the `i`-th node. Return `undefined` if index is out of bounds.
- `insertHead()`: Accepts a parameter `value` and inserts `value` at the head of the list.
- `insertTail()`: Accepts a parameter `value` and inserts `value` at the tail of the list.
- `remove()`: Accepts an integer parameter `i` and removes the item at the `i`-th index while returning its value. Return `undefined` if index is out of bounds.
- `toArray()`: Returns an array containing all the items in the linked list from head (first element in the array) to tail (last element in the array).
- `length()`: Returns the number of elements in the linked list.

### Examples

```js
const linkedlist = new LinkedList();
linkedlist.toArray(); // []
linkedlist.insertTail(1);
linkedlist.insertHead(2);
linkedlist.toArray(); // [2, 1]
linkedlist.insertTail(3);
linkedlist.toArray(); // [2, 1, 3]
linkedlist.length(); // 3
linkedlist.get(1); // 1
linkedlist.get(2); // 3
linkedlist.remove(1); // 1
linkedlist.toArray(); // [2, 3]
```

## Hints

### What must `head` and `tail` agree on?

In an empty list both are `null`. Otherwise, `head` begins the chain and `tail` is its final node; inserting the first item must establish both references.

### Which removals change an endpoint?

Removing the head replaces `head`, removing the tail replaces `tail`, and removing the only node does both. Trace each case before sharing the general removal logic.

### Where should removal traversal stop?

Stop at the node before the requested index. Its `next` link is the one that can bypass the removed node without losing the rest of the list.

## Starter code

**TypeScript**

```ts
export default class LinkedList<T> {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the head of the linked list.
   * @param {T} value The item to be added to the head of the list.
   */
  insertHead(value: T): void {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the tail of the linked list.
   * @param {T} value The item to be added to the tail of the list.
   */
  insertTail(value: T): void {
    throw new Error("Not implemented!");
  }

  /**
   * Remove the item in the given index and return its value or `undefined` if index is out of bounds.
   * @param {number} i The index of the item to be removed.
   * @return {T | undefined} The value at index i if it exists, `undefined` otherwise.
   */
  remove(i: number): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Return the value of the item at the given index or `undefined` if index is out of bounds.
   * @param {number} i The index of the value to retrieve.
   * @return {T | undefined} The value at index i if it exists, `undefined` otherwise.
   */
  get(i: number): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Return an array containing all the values in the linked list from head to tail.
   * @return {Array<T>} The array of all values in the linked list from head to tail.
   */
  toArray(): Array<T> {
    throw new Error("Not implemented!");
  }

  /**
   * Return the number of elements in the linked list.
   * @return {number} The length of the list.
   */
  length(): number {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class LinkedList {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the head of the linked list.
   * @param {*} value The item to be added to the head of the list.
   */
  insertHead(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the tail of the linked list.
   * @param {*} value The item to be added to the tail of the list.
   */
  insertTail(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Remove the item in the given index and return its value or `undefined` if index is out of bound.
   * @param {int} i The index of the item to be removed.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  remove(i) {
    throw new Error("Not implemented!");
  }

  /**
   * Return the value of the item in the given index or `undefined` if index is out of bound.
   * @param {int} i The index of the value of the item to be returned.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  get(i) {
    throw new Error("Not implemented!");
  }

  /**
   * Return an array containing all the values of the items in the linked list from head to tail.
   * @return {*} The array of all the values in the linked list from head to tail.
   */
  toArray() {
    throw new Error("Not implemented!");
  }

  /**
   * Return the length / number of elements in the linked list.
   * @return {*} Length of the linked list.
   */
  length() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

Linked lists are chains of connected nodes, where each node contains a `value` and a reference to the `next` node. The `next` in each node forms the links required to make linked lists.

In the `LinkedList` class, `head` and `tail` are used to indicate the start and end of the list. While using only `head` is possible, maintaining a `tail` pointer improves the time complexity of operations like `insertTail()` and enables efficient use cases such as implementing queues.

#### Insert

`insertHead()` and `insertTail()` involve updating the `head` or `tail` of the list to point to a new node.

![Insert Head](https://www.gfecdn.net/img/questions/linked-list/insert-head.webp)

![Insert Tail](https://www.gfecdn.net/img/questions/linked-list/insert-tail.webp)

#### Remove

`remove()` modifies the `next` reference of node `i-1` to point to node `i+1`, effectively removing node `i` from the list. If the removed node is at the head or tail, the `head` or `tail` pointers are also updated accordingly.

![Remove](https://www.gfecdn.net/img/questions/linked-list/remove.webp)

#### Get and toArray

`get()` and `toArray()` traverse the list from the `head` node. `get()` stops at the specified index, while `toArray()` continues until the `tail`, collecting all values.

#### Length

`length()` traverses through the entire linked list to count the number of elements. Alternatively, a length variable can be maintained to track the length of the linked list every time a node is inserted/removed.

**JavaScript**

```js
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  /**
   * Adds an item to the head of the linked list.
   * @param {*} value The item to be added to the head of the list.
   */
  insertHead(value) {
    const node = new Node(value, this.head);
    if (this.head == null) {
      this.tail = node;
    }
    this.head = node;
  }

  /**
   * Adds an item to the tail of the linked list.
   * @param {*} value The item to be added to the tail of the list.
   */
  insertTail(value) {
    const node = new Node(value);
    if (this.tail == null) {
      this.head = node;
    } else {
      this.tail.next = node;
    }
    this.tail = node;
  }

  /**
   * Remove the item in the given index and return its value or `undefined` if index is out of bound.
   * @param {number} i The index of the item to be removed.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  remove(i) {
    if (i < 0) {
      return undefined;
    }

    // To remove index 0, we have to replace the value of head, if it exists.
    if (i === 0 && this.head != null) {
      let value = this.head.value;
      this.head = this.head.next;
      if (this.head == null) {
        this.tail = null;
      } // If there is no node left in the linked list, replace tail with null as well.
      return value;
    }

    let curr = this.head; // Set a pointer to the first node of the linked list.
    // Point the pointer to the next node for i-1 times to reach index i-1.
    for (let j = 1; j < i; j++) {
      if (curr == null || curr.next == null) {
        return undefined;
      } // Return `undefined` if linked list ends before reaching index i.

      curr = curr.next; // Change the current pointer to the next one.
    }

    if (curr == null || curr.next == null) {
      return undefined;
    }

    let value = curr.next.value; // Save the value of the node in index i.
    curr.next = curr.next.next;

    // If curr.next, which is to be removed, is the last node in the linked list, update tail to the previous node (curr).
    this.tail = curr.next == null ? curr : this.tail;

    return value; // Return the value of the node in index i.
  }

  /**
   * Return the value of the item in the given index or `undefined` if index is out of bound.
   * @param {number} i The index of the value of the item to be returned.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  get(i) {
    if (i < 0) {
      return undefined;
    }

    let curr = this.head; // Set a pointer to the first node of the linked list.
    // Point the pointer to the next node for i times to reach index i.
    for (let j = 0; j < i; j++) {
      if (curr == null) {
        return undefined;
      } // Return `undefined` if linked list ends before reaching index i.

      curr = curr.next; // Change the current pointer to the next one.
    }

    let value = curr != null ? curr.value : undefined;
    return value; // Return the value of the node in index i.
  }

  /**
   * Return an array containing all the values of the items in the linked list from head to tail.
   * @return {*} The array of all the values in the linked list from head to tail.
   */
  toArray() {
    const array = [];
    let curr = this.head; // Set a pointer to the first node of the linked list.

    // Continue to traverse through the linked list until it reaches the tail (null).
    while (curr != null) {
      array.push(curr.value);
      curr = curr.next; // Change the current pointer to the next one.
    }

    return array;
  }

  /**
   * Return the length / number of elements in the linked list.
   * @return {*} Length of the linked list.
   */
  length() {
    let length = 0;
    let curr = this.head;

    while (curr) {
      length += 1;
      curr = curr.next;
    }

    return length;
  }
}
```

**TypeScript**

```ts
class Node<T> {
  value: any;
  next: Node<T> | null;

  constructor(value: any, next: Node<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

export default class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  /**
   * Adds an item to the head of the linked list.
   * @param {*} value The item to be added to the head of the list.
   */
  insertHead<T>(value: T): void {
    const node = new Node<T>(value, this.head);
    if (this.head == null) {
      this.tail = node;
    }
    this.head = node;
  }

  /**
   * Adds an item to the tail of the linked list.
   * @param {*} value The item to be added to the tail of the list.
   */
  insertTail<T>(value: T): void {
    const node = new Node<T>(value);
    if (this.tail == null) {
      this.head = node;
    } else {
      this.tail.next = node;
    }
    this.tail = node;
  }

  /**
   * Remove the item in the given index and return its value or `undefined` if index is out of bound.
   * @param {number} i The index of the item to be removed.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  remove<T>(i: number): T | undefined {
    if (i < 0) {
      return undefined;
    }

    // To remove index 0, we have to replace the value of head, if it exists.
    if (i === 0 && this.head != null) {
      let value = this.head.value;
      this.head = this.head.next;
      if (this.head == null) {
        this.tail = null;
      } // If there is no node left in the linked list, replace tail with null as well.
      return value;
    }

    let curr: Node<T> | null = this.head; // Set a pointer to the first node of the linked list.
    // Point the pointer to the next node for i-1 times to reach index i-1.
    for (let j = 1; j < i; j++) {
      if (curr == null || curr.next == null) {
        return undefined;
      } // Return `undefined` if linked list ends before reaching index i.

      curr = curr.next; // Change the current pointer to the next one.
    }

    if (curr == null || curr.next == null) {
      return undefined;
    }

    let value = curr.next.value; // Save the value of the node in index i.
    curr.next = curr.next.next;

    // If curr.next, which is to be removed, is the last node in the linked list, update tail to the previous node (curr).
    this.tail = curr.next == null ? curr : this.tail;

    return value; // Return the value of the node in index i.
  }

  /**
   * Return the value of the item in the given index or `undefined` if index is out of bound.
   * @param {number} i The index of the value of the item to be returned.
   * @return {*} The value of the item in index i if it exists, `undefined` otherwise.
   */
  get<T>(i: number): T | undefined {
    if (i < 0) {
      return undefined;
    }

    let curr: Node<T> | null = this.head; // Set a pointer to the first node of the linked list.
    // Point the pointer to the next node for i times to reach index i.
    for (let j = 0; j < i; j++) {
      if (curr == null) {
        return undefined;
      } // Return `undefined` if linked list ends before reaching index i.

      curr = curr.next;
    }

    let value = curr != null ? curr.value : undefined;
    return value; // Return the value of the node in index i.
  }

  /**
   * Return an array containing all the values of the items in the linked list from head to tail.
   * @return {*} The array of all the values in the linked list from head to tail.
   */
  toArray<T>(): Array<T> {
    const array: Array<T> = [];
    let curr: Node<T> | null = this.head; // Set a pointer to the first node of the linked list.

    // Continue to traverse through the linked list until it reaches the tail (null).
    while (curr != null) {
      array.push(curr.value);
      curr = curr.next; // Change the current pointer to the next one.
    }

    return array;
  }

  /**
   * Return the length / number of elements in the linked list.
   * @return {*} Length of the linked list.
   */
  length(): number {
    let length = 0;
    let curr = this.head;

    while (curr) {
      length += 1;
      curr = curr.next;
    }

    return length;
  }
}
```

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

- `insertHead()` and `insertTail()`: O(1) as we can access `head` and `tail` immediately.
- `get()`, `remove()`, `toArray()`: O(n) as the worst case is to traverse through the entire linked list to search for the specific index for `get()` and `remove()`.
- `length()`: O(n) if traversing the entire array to calculate length, O(1) if maintaining a length variable.

#### Space complexity

- All methods require O(1) space, as no additional data structures are created that grow with input size.

### Edge cases

- **Empty list**: When operating on an empty list, `insertHead()` and `insertTail()` must set both `head` and `tail`.
- **Invalid index**: In `get()` and `remove()`, index values less than 0 or greater than or equal to the list length must be handled gracefully. One common approach is to return `undefined`, as used in this problem.

### Techniques

- Object-oriented programming.

## Exercises

### Check your understanding 1

Keeping `tail` makes appending constant time. Does it also make removing the last node constant time in this singly linked list? Explain what information is missing and what a different representation would need.

**Answer**

No. Removing the tail must set its predecessor's `next` to null and make that predecessor the new tail. A tail reference does not provide a backward link, so finding the predecessor requires a traversal in the general case. A doubly linked list could follow `tail.prev` directly, at the cost of extra links and updates. The one-node case still needs both endpoints cleared.

**Checklist**

- Identify the predecessor as the missing information, rather than the tail itself.
- Explain why traversal is required for the general singly linked case.
- Connect constant-time tail removal to maintaining backward links.

### Check your understanding 2

A list forgets to clear `tail` when its only node is removed. `insertTail()` decides whether the list is empty by checking `tail`. Which sequence exposes the stale reference through `toArray()`?

- [ ] Insert `1`, `2`, and `3`; remove index `1`; inspect the array.
  > Removing a middle node never makes the list empty, so it does not exercise this bug.
- [x] Insert `1`; remove index `0`; insert `2`; inspect the array.
  > The stale tail links the new node to a detached node while head remains null. The result should be [2], but traversal from head finds nothing.
- [ ] Insert `1`; insert `2`; inspect the array.
  > Both insertions occur before the faulty emptying transition.
- [ ] Insert `1`; remove index `1`; inspect the array.
  > An out-of-bounds removal leaves the only node in place and should not clear either endpoint.
