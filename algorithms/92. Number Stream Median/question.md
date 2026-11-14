# Number Stream Median

**Difficulty:** Hard · **Duration:** ~55 min · **Topics:** Heap

> Source: [number-stream-median](https://www.greatfrontend.com/questions/algo/number-stream-median)

The median of a list of numbers is defined as the middle value in a sorted list. When the list has an even number of elements, the median is the average of the two middle values.

For example:

- For the list `[1, 2, 3]`, the median is 2
- For the list `[1, 2]`, the median is (1 + 2) / 2 = 1.5

Implement a `NumberStream` class with the following methods:

- `add(num: number): void`: Adds an integer num to the data structure
- `getMedian(): number`: Returns the median of all numbers added so far

### Input

The `NumberStream` instance will have its methods called with various parameters based on these:

- `methods: string[]`: An array of `NumberStream` method names
- `params: (number | null)[]`: An array of integers

`methods[i]` will be called with `params[i]`.

| Input                                                              | Output               | Explanation                                                                |
| ------------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------- |
| `methods = ["add","getMedian"], params = [4,null]`                 | `[null,4]`           | Add 4 to the stream, then find the median, which is 4.                     |
| `methods = ["add","add","getMedian"], params = [10,20,null]`       | `[null,null,15]`     | Add 10 and 20 to the stream. The median of [10, 20] is (10 + 20) / 2 = 15. |
| `methods = ["add","add","add","getMedian"], params = [1,2,3,null]` | `[null,null,null,2]` | Add 1, 2, 3 to the stream. The median of [1, 2, 3] is 2.                   |

### Constraints

- 1 <= `num` <= 100,000
- 1 <= `methods.length` <= 1,000
- There will be at least one element in the data structure before calling `getMedian()`

## Hints

### Which values can determine the median?

Split the numbers into a lower and upper half. Only the largest lower value and smallest upper value are needed, which suggests a max-heap paired with a min-heap.

### What must stay true after an insertion?

Every lower value must be no greater than every upper value, and the heap sizes may differ by at most one. Once those conditions hold, the one or two heap roots determine the median.

## Starter code

**TypeScript**

```ts
export default class NumberStream {
  add(num: number): void {
    throw new Error("Not implemented!");
  }

  getMedian(): number {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class NumberStream {
  /**
   * Adds an integer into the data structure
   *
   * @param {number} num
   */
  add(num) {
    throw new Error("Not implemented!");
  }

  /**
   * Returns the median of the current number stream
   *
   * @returns {number}
   */
  getMedian() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### 1. Brute Force Approach Using Sort

The goal of this problem is to calculate the median of a stream of numbers dynamically. The brute force approach maintains a list of all numbers received so far and calculates the median after sorting the list each time a median is requested.

The median is defined as:

- The middle element if the total count of numbers is odd.
- The average of the two middle elements if the total count of numbers is even.

This approach works by:

1. Storing all incoming numbers in an array.
2. Sorting the array each time the `getMedian` method is called to ensure the numbers are in ascending order.
3. Calculating the median based on the sorted array.

#### Algorithm

1. Create a `NumberStream` class with a private array `store` to hold all incoming numbers.
2. Define an `add` method to append a number to the `store` array.
3. Define a `getMedian` method to calculate the median:
4. Sort the `store` array in ascending order.
5. Determine the size of the array (`n`).
6. If `n` is odd, return the middle element.
7. If `n` is even, compute the average of the two middle elements and return the result.

```ts
export default class NumberStream {
  // Array to store the numbers
  private store: number[] = [];

  // Adds a number into the data structure
  add(num: number): void {
    // Add the number to the array
    this.store.push(num);
  }

  // Returns the median of the current number stream
  getMedian(): number {
    // Sort the array
    this.store.sort((a, b) => a - b);

    const n = this.store.length;

    // Compute the median
    if (n % 2 === 1) {
      // If the size is odd, return the middle element
      return this.store[Math.floor(n / 2)];
    }

    // If the size is even, return the average of the two middle elements
    const mid1 = this.store[n / 2 - 1];
    const mid2 = this.store[n / 2];
    return (mid1 + mid2) * 0.5;
  }
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the array dominates the runtime of the `getMedian` method. Adding a number to the `store` array takes O(1).
- **Space complexity: O(n)**. The `store` array grows linearly with the number of elements in the stream.

### 2. Using Two Heaps

This solution optimizes the process of finding the median in a dynamic data stream by utilizing two heaps: a max heap and a min heap. The core idea is to maintain two balanced heaps:

1. A max heap (`maxHeap`) that contains the smaller half of the numbers.
2. A min heap (`minHeap`) that contains the larger half of the numbers.

The heaps are structured such that the top of the max heap represents the largest number in the smaller half, and the top of the min heap represents the smallest number in the larger half. This structure allows efficient retrieval of the median:

- If the heaps are balanced in size, the median is the average of the tops of both heaps.
- If the max heap has one more element than the min heap, the median is the top of the max heap.

The approach ensures that the heaps remain balanced after each insertion:

1. A new number is first added to the max heap.
2. The largest number from the max heap is moved to the min heap to maintain order.
3. If the min heap grows larger than the max heap, the smallest number from the min heap is moved back to the max heap.

By using the heap property, the solution avoids sorting all stored values for each query. Insertion takes O(log n), while reading the median from the two roots takes O(1).

#### Algorithm

1. Initialize two heaps:

- `maxHeap` for the smaller half of the numbers.
- `minHeap` for the larger half of the numbers.

2. Define an `add` method to insert a new number into the data stream:
1. Add the number to `maxHeap`.
1. Move the largest number from `maxHeap` to `minHeap` to maintain order.
1. If `minHeap` grows larger than `maxHeap`, move the smallest number from `minHeap` back to `maxHeap`.
1. Define a `getMedian` method to calculate the median:
1. If `maxHeap` has more elements than `minHeap`, return the top of `maxHeap`.
1. Otherwise, return the average of the tops of both heaps.
1. Use utility functions for heap operations:

- `addNumberToHeap` to insert a number while maintaining the heap property.
- `removeTopFromHeap` to remove the top element while restoring the heap property.
- `heapify` to ensure the heap property from a given index downward.

```ts
export default class NumberStream {
  // Max heap to store the smaller half of the numbers
  private maxHeap: number[] = [];

  // Min heap to store the larger half of the numbers
  private minHeap: number[] = [];

  // Adds a number into the data structure
  add(num: number): void {
    // Add the new number to the max heap (lo)
    this.addNumberToHeap(this.maxHeap, num, (a, b) => a - b);

    // Balance the heaps: move the largest number from maxHeap to minHeap
    this.addNumberToHeap(
      this.minHeap,
      this.removeTopFromHeap(this.maxHeap),
      (a, b) => b - a,
    );

    // Ensure that maxHeap has more elements than minHeap if their sizes differ
    if (this.maxHeap.length < this.minHeap.length) {
      this.addNumberToHeap(
        this.maxHeap,
        this.removeTopFromHeap(this.minHeap),
        (a, b) => a - b,
      );
    }
  }

  // Returns the median of the current data stream
  getMedian(): number {
    // If maxHeap has more elements, the median is its top element
    if (this.maxHeap.length > this.minHeap.length) {
      return this.maxHeap[0];
    }
    // Otherwise, the median is the average of the tops of maxHeap and minHeap
    else {
      return (this.maxHeap[0] + this.minHeap[0]) * 0.5;
    }
  }

  // Utility function to add a number to a heap, maintaining the heap property
  private addNumberToHeap(
    heap: number[],
    num: number,
    comparator: (a: number, b: number) => number,
  ): void {
    heap.push(num);
    let i = heap.length - 1;

    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);
      if (comparator(heap[i], heap[parent]) > 0) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
      } else {
        break;
      }
    }
  }

  // Utility function to remove the top element from a heap, maintaining the heap property
  private removeTopFromHeap(heap: number[]): number {
    if (heap.length === 0) return NaN;
    const top = heap[0];
    const last = heap.pop();

    if (heap.length > 0 && last !== undefined) {
      heap[0] = last;
      this.heapify(heap, 0, (a, b) => (heap === this.maxHeap ? a - b : b - a));
    }

    return top;
  }

  // Utility function to maintain the heap property from the given index downwards
  private heapify(
    heap: number[],
    i: number,
    comparator: (a: number, b: number) => number,
  ): void {
    const length = heap.length;
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < length && comparator(heap[left], heap[largest]) > 0) {
      largest = left;
    }

    if (right < length && comparator(heap[right], heap[largest]) > 0) {
      largest = right;
    }

    if (largest !== i) {
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      this.heapify(heap, largest, comparator);
    }
  }
}
```

#### Big-O analysis

- **Time complexity: O(log n) per insertion and O(1) per median query**. Processing n insertions takes O(n log n) in total.
- **Space complexity: O(n)**. The heaps together store all elements in the data stream.

## Exercises

### Check your understanding 1

A candidate sends values to either heap solely to keep their sizes balanced. It ends with lower max-heap `[100, 1]` and upper min-heap `[2, 3]`. Why is averaging the roots wrong here, even though both heaps and their sizes are valid? Explain the additional boundary check that certifies the partition.

**Answer**

The roots average to 51, but the sorted stream is [1, 2, 3, 100], whose median is 2.5. Size balance does not ensure that the lower heap actually contains the lower values. Require max(lower) <= min(upper). Since every lower value is at most its max-root and every upper value is at least its min-root, that single boundary comparison proves all lower values precede all upper values. Together with the size convention, it makes the roots the middle values.

**Checklist**

- Demonstrate the wrong median despite individually valid heaps.
- State the missing cross-heap ordering condition.
- Use the extremal-root properties to justify checking only the boundary.

### Check your understanding 2

After adding `5`, `1`, `9`, and `3`, the lower half keeps the extra value only when needed. Which lower root, upper root, and median are consistent with the two-heap invariants?

- [ ] Lower root `5`, upper root `3`, median `4`.
  > The lower root cannot exceed the upper root because every lower-half value must be no greater than every upper-half value.
- [x] Lower root `3`, upper root `5`, median `4`.
  > The sorted stream is `[1, 3, 5, 9]`, so 3 and 5 are the roots at the split and their average is 4.
- [ ] Lower root `1`, upper root `9`, median `5`.
  > Heap roots expose the values nearest the split, not the minimum and maximum of the entire stream.
- [ ] Lower root `3`, upper root `5`, median `3`.
  > With equal heap sizes, the stream has an even count and the median must average both boundary roots.
