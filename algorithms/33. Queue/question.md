# Queue

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Queue

> Source: [queue](https://www.greatfrontend.com/questions/algo/queue)

Implement a queue data structure in JavaScript that contains the following operations:

- `new Queue()`: Creates an instance of a `Queue` class that doesn't contain any items. The constructor does not accept any arguments.
- `enqueue(item)`: Adds `item` to the back of the queue and returns the new number of items. Required time complexity: O(1).
- `dequeue()`: Removes and returns the item at the front of the queue, or returns `undefined` if the queue is empty. Required time complexity: O(1).
- `isEmpty()`: Determines if the queue is empty. Required time complexity: O(1).
- `front()`: Returns the item at the front of the queue without removing it, or returns `undefined` if the queue is empty. Required time complexity: O(1).
- `back()`: Returns the item at the back of the queue without removing it, or returns `undefined` if the queue is empty. Required time complexity: O(1).
- `length()`: Returns the number of items in the queue. Required time complexity: O(1).

### Examples

```js
const queue = new Queue();
queue.isEmpty(); // true
queue.enqueue(1);
queue.enqueue(2);
queue.length(); // 2
queue.enqueue(3);
queue.front(); // 1
queue.back(); // 3
queue.dequeue(); // 1
queue.isEmpty(); // false
```

## Hints

### Which operations touch each end?

Trace an empty queue as one item is added, another is added, and both are removed. What would you need direct access to so none of those operations shifts or walks past other items?

### What state is worth storing?

`length()` cannot count the items on every call and remain O(1). Consider what can be updated as the queue changes, then check that it still makes sense during the empty-to-one and one-to-empty transitions.

## Starter code

**TypeScript**

```ts
export default class Queue<T> {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the back of the queue.
   * @param {T} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item: T): number {
    throw new Error("Not implemented!");
  }

  /**
   * Removes an item from the front of the queue.
   * @return {T | undefined} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty(): boolean {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {T | undefined} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue.
   * @return {T | undefined} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length(): number {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class Queue {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the back of the queue.
   * @param {*} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item) {
    throw new Error("Not implemented!");
  }

  /**
   * Removes an item from the front of the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue() {
    throw new Error("Not implemented!");
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue.
   * @return {*} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

Queues should be implemented with linked lists which are essentially a chain of connected nodes. To simplify handling of linked list manipulation of empty queues, we make use of doubly-linked lists (nodes have both `prev` and `next` pointers) and dummy/sentinel head/tail nodes. With the usage of dummy nodes, the linked list will never be "empty" and we don't have to separately handle the case of enqueuing into empty queues and dequeuing a queue with only one item.

![Empty Queue](https://www.gfecdn.net/img/questions/queue/empty-queue.webp)

`enqueue()`-ing involves creating a new `Node` and adding it between the `_dummyTail` node and `_dummyTail.next` (which is `_dummyHead` in the case of empty queues).

![Enqueue one item](https://www.gfecdn.net/img/questions/queue/enqueue-a.webp)

![Enqueue second item](https://www.gfecdn.net/img/questions/queue/enqueue-b.webp)

`dequeue()`-ing involves removing the node between the `_dummyHead` node and `_dummyHead.prev`. This should be a no-op if the queue is empty otherwise `_dummyTail` will get dequeued.

![Dequeue](https://www.gfecdn.net/img/questions/queue/dequeue.webp)

Since the time complexity of `length()` has to be O(1) and counting the number of items in a linked list will take O(n), we need to separately track the number of items in the list with a `_length` instance property and update it within the `enqueue()` and `dequeue()` methods.

Note that the autograder doesn't check if the time complexity of your `enqueue()` and `dequeue()` operations are O(1), but if you're only using a single JavaScript array to solve this question, then it's almost certainly not achieving O(1) time complexity for either of those operations.

**JavaScript**

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default class Queue {
  constructor() {
    this._dummyHead = new Node();
    this._dummyTail = new Node();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   * @param {*} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node.prev;
    this._dummyHead.prev = newFirst;
    newFirst.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node.prev = null;
    node.next = null;
    this._length--;
    return node.value;
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty() {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   * @return {*} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length() {
    return this._length;
  }
}
```

**TypeScript**

```ts
class Node<T> {
  value: T | undefined;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value?: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default class Queue<T> {
  _dummyHead: Node<T>;
  _dummyTail: Node<T>;
  _length: number;

  constructor() {
    this._dummyHead = new Node<T>();
    this._dummyTail = new Node<T>();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   */
  enqueue(item: T) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast!.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node!.prev;
    this._dummyHead.prev = newFirst;
    newFirst!.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node!.prev = null;
    node!.next = null;
    this._length--;
    return node!.value;
  }

  /**
   * Determines if the queue is empty.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   */
  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev!.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   */
  back(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next!.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length(): number {
    return this._length;
  }
}
```

### Edge cases

- Calling `dequeue()` on empty stacks.
- Calling `front()` on empty stacks.
- Calling `back()` on empty stacks.

### Techniques

- Object-oriented programming.
- Linked list manipulation.

## Exercises

### Check your understanding 1

A queue implemented with array `push()` and `shift()` passes all ordering tests. Assuming `shift()` moves the remaining entries, explain why draining a queue of n items violates the required per-operation bound. What state would a singly linked implementation keep?

**Answer**

The first removal moves about n - 1 entries, the next n - 2, and so on, for Θ(n²) total work to drain the queue. Correct FIFO output does not establish O(1) removal. A singly linked queue can keep head, tail, and count: append through tail, remove through head, and update count directly. When the last node leaves, both endpoints must become empty so the next enqueue works.

**Checklist**

- Sum the shifting work across a full drain.
- Distinguish functional tests from complexity evidence.
- Name direct endpoints and a maintained count, including the empty transition.

### Check your understanding 2

A queue decrements its stored count before checking whether `dequeue()` has an item to remove. Which sequence most directly exposes the error through the public API?

- [ ] Enqueue A and B, then check that length is 2.
  > No dequeue runs, so the misplaced decrement is not exercised.
- [ ] Enqueue A, dequeue it, then check that length is 0.
  > A successful removal should decrement the count, so this sequence does not isolate an empty removal.
- [x] On a new queue, call dequeue, then check that length is 0 and isEmpty is true.
  > An empty dequeue is a no-op. The unconditional decrement produces -1 and can make a count-equals-zero emptiness check false.
- [ ] Enqueue A, read front and back, then check that length is 1.
  > Endpoint reads do not invoke the faulty dequeue path.
