# Heap

**Difficulty:** Hard · **Duration:** ~15 min · **Topics:** Heap

> Source: [heap](https://www.greatfrontend.com/questions/algo/heap)

Implement a heap data structure in JavaScript that supports the following operations:

- `new Heap(array)`: Creates an instance of a Heap class initialized with `array` and heapifies it to form as the initial Heap structure. It also initializes any internal structure needed to maintain the heap properties.
- `heapify(array)`: Constructs the heap from an unordered array, establishing the max heap property across all elements. This is performed as part of the constructor, or can be a separate method that resets and rebuilds the heap. Required time complexity: O(n), where n is the number of elements in the array.
- `insert(value)`: Adds a new value to the heap, maintaining the max heap property. Required time complexity: O(log n), where n is the number of elements in the heap after insertion.
- `delete()`: Removes and returns the maximum value from the heap, maintaining the max heap property after removal. Returns `undefined` if the heap is empty. Required time complexity: O(log n).
- `findMax()`: Returns the maximum value in the heap without removing it, or `undefined` if the heap is empty. Required time complexity: O(1).

### Examples

```js
const heap = new Heap();
heap.insert(20);
heap.insert(15);
heap.insert(30);
heap.findMax(); // 30
heap.insert(10);
heap.delete(); // 30
heap.findMax(); // 20

const array = [5, 3, 17, 10, 84, 19, 6, 22, 9];
const newHeap = new Heap(array);
newHeap.findMax(); // 84
```

## Hints

### Where does a max-heap keep its largest value?

Represent the complete tree in an array and preserve the rule that every parent is at least as large as its children. Work out the parent and child indices from a few positions.

### Which path can an update disturb?

An appended value can only violate the rule with its ancestors. Replacing the root with the last value can only violate it along one path toward the leaves.

### Why doesn't `heapify` need repeated insertion?

Leaves already satisfy the heap rule. Repairing internal nodes from the last parent back to the root builds on subtrees that are already heaps and meets the required O(n) bound.

## Starter code

**TypeScript**

```ts
export default class Heap<T> {
  constructor(array: T[] = []) {
    throw new Error("Not implemented!");
  }

  /**
   * Constructs the initial heap structure with a given `array`.
   * @param array The initial array to be used for the heap.
   */
  heapify(array: T[]): void {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item to the heap.
   * @param value The item to be added into the heap.
   */
  insert(value: T): void {
    throw new Error("Not implemented!");
  }

  /**
   * Removes the top of the heap / maximum element.
   * @return The element removed, or undefined if the heap is empty.
   */
  delete(): T | undefined {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the value of the maximum element.
   * @return The maximum element.
   */
  findMax(): T | undefined {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class Heap {
  constructor(array = []) {
    throw new Error("Not implemented!");
  }

  /**
   * Constructs the initial heap structure with a given `array`.
   * @param {Array} array The initial array.
   */
  heapify(array) {
    throw new Error("Not implemented!");
  }

  /**
   * Adds an item into the heap.
   * @param {*} item The item to be added into the heap.
   */
  insert(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Removes the top of the heap / maximum element.
   * @return {*} The element removed.
   */
  delete() {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the value of the maximum element.
   * @return {number} The maximum element.
   */
  findMax() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

Heaps are specialized tree-based data structures that satisfy the heap property, where in a max heap, each parent node is greater than or equal to the values of its children. This property makes heaps ideal for implementing priority queues, where the highest (or lowest) priority element needs to be accessed quickly.

#### Operations

- `heapify(array)`: Copies the unordered array, then restores the heap property from the last internal node back to the root. Leaves already satisfy the invariant, so each internal node only needs to sift down.
- `insert(value)`: Adds a new element to a heap. This involves appending the element at the end of the array (which represents the heap) and then move up the newly added element until the heap property is restored if it's violated.

![Insert](https://www.gfecdn.net/img/questions/heap/insert.webp)

- `delete()`: Removes the root element of the heap, which is the maximum value in a max heap. The last element of the heap replaces the root, and then slowly move it down until the heap property is restored.

![Delete](https://www.gfecdn.net/img/questions/heap/delete.webp)

- `findMax()`: Returns the element at the root of the heap without removing it, providing constant time access to the maximum value.

Since the operations `insert` and `delete` can potentially involve moving elements across the height of the heap, their time complexity is O(log n), where n is the number of elements in the heap. `findMax` is a constant-time operation, O(1), as it returns the first element. Bottom-up `heapify` runs in O(n): most nodes are close to the leaves and move only a small distance, so the total sift-down work across all internal nodes is linear.

### Edge cases

- Inserting into an empty heap.
- Deleting from an empty heap.
- Calling `findMax` on an empty heap.

### Techniques

- Object-oriented programming.
- Array manipulation to simulate a binary tree.
- Understanding of logarithmic time complexity and how operations can affect it.

**JavaScript**

```js
export default class Heap {
  constructor(array = []) {
    this.values = [];
    if (array.length > 0) {
      this.heapify(array);
    }
  }

  /**
   * Constructs the initial heap structure with a given `array`.
   * @param {Array} array The initial array.
   */
  heapify(array) {
    this.values = [...array];

    // Leaves already satisfy the heap property. Repair each internal node
    // from the last parent back to the root.
    for (
      let parent = Math.floor(this.values.length / 2) - 1;
      parent >= 0;
      parent--
    ) {
      let index = parent;

      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let largest = index;

        if (
          left < this.values.length &&
          this.values[left] > this.values[largest]
        ) {
          largest = left;
        }
        if (
          right < this.values.length &&
          this.values[right] > this.values[largest]
        ) {
          largest = right;
        }
        if (largest === index) {
          break;
        }

        [this.values[index], this.values[largest]] = [
          this.values[largest],
          this.values[index],
        ];
        index = largest;
      }
    }
  }

  /**
   * Adds an item into the heap.
   * @param {*} item The item to be added into the heap.
   */
  insert(value) {
    this.values.push(value);
    let index = this.values.length - 1;
    let parentIndex = Math.floor((index - 1) / 2);

    // Move up the newly added value until the heap property is restored.
    while (index > 0 && this.values[parentIndex] < this.values[index]) {
      [this.values[parentIndex], this.values[index]] = [
        this.values[index],
        this.values[parentIndex],
      ];
      index = parentIndex;
      parentIndex = Math.floor((index - 1) / 2);
    }
  }

  /**
   * Removes the top of the heap / maximum element.
   * @return {*} The element removed.
   */
  delete() {
    if (this.values.length === 0) {
      return undefined;
    }
    const max = this.values[0];
    const last = this.values.pop();
    if (this.values.length === 0) {
      return max;
    }

    this.values[0] = last;
    let index = 0;

    // Restore heap property by moving down the root value.
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let largest = index;

      // If left child exists and is larger than the current largest, replace largest with value of left child.
      if (
        left < this.values.length &&
        this.values[left] > this.values[largest]
      ) {
        largest = left;
      }

      // If right child exists and is larger than the current largest, replace largest with value of right child.
      if (
        right < this.values.length &&
        this.values[right] > this.values[largest]
      ) {
        largest = right;
      }

      if (largest === index) {
        break; // The current root is already the largest, heap property is satisfied.
      }

      // Swap the position such that the largest value is above `index`, following the heap property.
      [this.values[index], this.values[largest]] = [
        this.values[largest],
        this.values[index],
      ];
      index = largest;
    }

    return max;
  }

  /**
   * Returns the value of the maximum element.
   * @return {number} The maximum element.
   */
  findMax() {
    return this.values.length > 0 ? this.values[0] : undefined;
  }
}
```

**TypeScript**

```ts
export default class Heap<T> {
  values: T[];

  constructor(array: T[] = []) {
    this.values = [];
    if (array.length > 0) {
      this.heapify(array);
    }
  }

  /**
   * Constructs the initial heap structure with a given `array`.
   * @param array The initial array to be used for the heap.
   */
  heapify(array: T[]): void {
    this.values = [...array];

    // Leaves already satisfy the heap property. Repair each internal node
    // from the last parent back to the root.
    for (
      let parent = Math.floor(this.values.length / 2) - 1;
      parent >= 0;
      parent--
    ) {
      let index = parent;

      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let largest = index;

        if (
          left < this.values.length &&
          this.values[left] > this.values[largest]
        ) {
          largest = left;
        }
        if (
          right < this.values.length &&
          this.values[right] > this.values[largest]
        ) {
          largest = right;
        }
        if (largest === index) {
          break;
        }

        [this.values[index], this.values[largest]] = [
          this.values[largest],
          this.values[index],
        ];
        index = largest;
      }
    }
  }

  /**
   * Adds an item to the heap.
   * @param value The item to be added into the heap.
   */
  insert(value: T): void {
    this.values.push(value);
    let index = this.values.length - 1;
    let parentIndex = Math.floor((index - 1) / 2);

    // Move up the newly added value until the heap property is restored.
    while (index > 0 && this.values[parentIndex] < this.values[index]) {
      [this.values[parentIndex], this.values[index]] = [
        this.values[index],
        this.values[parentIndex],
      ];
      index = parentIndex;
      parentIndex = Math.floor((index - 1) / 2);
    }
  }

  /**
   * Removes the top of the heap / maximum element.
   * @return The element removed, or undefined if the heap is empty.
   */
  delete(): T | undefined {
    if (this.values.length === 0) {
      return undefined;
    }
    const max = this.values[0];
    const last = this.values.pop();
    if (this.values.length > 0 && last !== undefined) {
      this.values[0] = last;
      let index = 0;

      // Restore heap property by moving down the root value.
      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let largest = index;

        // If left child exists and is larger than the current largest, replace largest with value of left child.
        if (
          left < this.values.length &&
          this.values[left] > this.values[largest]
        ) {
          largest = left;
        }

        // If right child exists and is larger than the current largest, replace largest with value of right child.
        if (
          right < this.values.length &&
          this.values[right] > this.values[largest]
        ) {
          largest = right;
        }

        if (largest === index) {
          break; // The current root is already the largest, heap property is satisfied.
        }

        // Swap the position such that the largest value is above `index`, following the heap property.
        [this.values[index], this.values[largest]] = [
          this.values[largest],
          this.values[index],
        ];
        index = largest;
      }
    }
    return max;
  }

  /**
   * Returns the value of the maximum element.
   * @return The maximum element.
   */
  findMax(): T | undefined {
    return this.values.length > 0 ? this.values[0] : undefined;
  }
}
```

## Exercises

### Check your understanding 1

A reviewer argues that bottom-up `heapify` costs O(n log n) because a sift-down can take O(log n). What does that argument overlook about where most nodes are in a complete binary tree?

**Answer**

It gives every node the root’s worst-case cost. About half the nodes are leaves and require no sift-down; about a quarter are at most one level above the leaves; fewer nodes can move two levels, and so on. Weighting the possible work by these decreasing node counts gives linear total work. Repeated insertion can still require O(n log n), because each new leaf may travel toward the root.

**Checklist**

- Explains why the maximum sift distance does not apply to every node.
- Uses the concentration of nodes near the leaves.
- Distinguishes bottom-up construction from repeated insertion.

### Check your understanding 2

A max heap uses the backing array `[20, 18, 15, 8, 10, 12, 14]`. After `delete()` removes `20`, which backing array results from the required sift-down process?

- [x] `[18, 14, 15, 8, 10, 12]`
  > The last value `14` replaces the root, then swaps with larger child `18`; it already exceeds `8` and `10`, so sifting stops.
- [ ] `[14, 18, 15, 8, 10, 12]`
  > Leaving `14` above child `18` violates the max-heap parent ordering and requires a swap.
- [ ] `[15, 18, 14, 8, 10, 12]`
  > When both children exceed the replacement, swapping with the larger child `18` is necessary to make the new root valid.
- [ ] `[20, 18, 15, 8, 10, 12]`
  > `delete()` removes and returns the root maximum `20`; the last value is used only as its replacement.
