# Most Common Elements

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Arrays, Heap

> Source: [array-most-common-elements](https://www.greatfrontend.com/questions/algo/array-most-common-elements)

Given an array of integers `numbers` and a number `k`, find the `k` most frequent numbers in the array. Here, `k` represents the number of elements that should be returned, which are the ones that appear the most frequently. The order of the result does not matter.

### Input

- `numbers: number[]`: An array of integers
- `k`: An integer

| Input                                | Output    | Explanation                                                                            |
| ------------------------------------ | --------- | -------------------------------------------------------------------------------------- |
| `numbers = [4,4,4,6,6,5,5,5], k = 2` | `[4,5]`   | The two most frequent numbers are 4 and 5, as they appear the most often in the array. |
| `numbers = [7,7,7,8,8,9,9,9], k = 3` | `[7,9,8]` | The three most frequent numbers are 7, 9, and 8.                                       |
| `numbers = [10,10,10,10,10], k = 1`  | `[10]`    | Since there is only one unique number, 10, it is the most frequent.                    |

### Constraints

- 1 <= `numbers.length` <= 1,000
- -10,000 <= `numbers[i]` <= 10,000
- 1 <= `k` <= Number of unique elements in `numbers`
- The solution is guaranteed to have a unique result

## Hints

### What should be counted before anything is ranked?

Once each distinct number has one frequency, the original array order no longer matters.

### How much of the frequency order is actually needed?

Only the top `k` entries matter. Compare fully sorting the distinct values with keeping a bounded set of current leaders.

## Starter code

**TypeScript**

```ts
export default function mostCommonElements(
  numbers: number[],
  k: number,
): number[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @param {number} k
 * @return {number[]}
 */
export default function mostCommonElements(numbers, k) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

A naive approach is to calculate the frequency of each element using nested loops. The frequencies are stored in a separate array, and then the array is sorted to find the most common elements.

#### Algorithm

1. Initialize an empty array `frequency` to store objects with `value` and `count` properties.
2. Iterate through the input array:

- For each number, check if it already exists in the `frequency` array.
- If it exists, increment its `count`.
- If it does not exist, add it to the `frequency` array with an initial `count` of 1.

3. Sort the `frequency` array in descending order of `count`.
4. Extract the first `k` elements from the sorted `frequency` array.
5. Return an array containing the `value` of the top `k` elements.

```ts
export default function mostCommonElements(
  numbers: number[],
  k: number,
): number[] {
  const frequency: { value: number; count: number }[] = [];

  // Step 1: Calculate frequencies manually using nested loops
  for (let i = 0; i < numbers.length; i++) {
    let found = false;
    for (let j = 0; j < frequency.length; j++) {
      if (frequency[j].value === numbers[i]) {
        frequency[j].count++;
        found = true;
        break;
      }
    }
    if (!found) {
      frequency.push({ value: numbers[i], count: 1 });
    }
  }

  // Step 2: Sort the frequencies array by count in descending order
  frequency.sort((a, b) => b.count - a.count);

  // Step 3: Extract the `k` most common elements
  const result: number[] = [];
  for (let i = 0; i < k && i < frequency.length; i++) {
    result.push(frequency[i].value);
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. This is due to the nested loop for frequency calculation.
- **Space complexity: O(n)**. If all `n` elements in numbers are unique, the frequency array will have a size of O(n).

### 2. Using Heap

The previous solution uses nested loops to count frequencies and sorts the frequency array. This approach counts frequencies with a hash map, then keeps the top `k` frequent elements in a min-heap instead of sorting all frequency entries.

#### Algorithm

1. Check if `k` is equal to the size of the input array. If true, return the array as all elements are required.
2. Create a hash map to count the frequency of each element in the array:

- Iterate through the array, updating the frequency count for each element in the hash map.

3. Initialize a min-heap with a custom comparator to sort elements by their frequency.
4. Iterate through the elements in the hash map:

- Insert each element into the heap while maintaining the heap's size to `k`.
- After each insertion, sort the heap using the comparator and remove the least frequent element if the heap size exceeds `k`.

5. Return the elements in the heap, which are the `k` most frequent elements.

```ts
export default function mostCommonElements(
  numbers: number[],
  k: number,
): number[] {
  // If k equals the size of numbers, return numbers as the result since all elements are required
  if (k === numbers.length) {
    return numbers;
  }

  // Step 1: Create a hash map to count the frequency of each element in numbers
  const countMap = new Map<number, number>();
  numbers.forEach((k) => {
    countMap.set(k, (countMap.get(k) || 0) + 1);
  });

  // Step 2: Initialize a min-heap with a custom comparator to keep the most frequent elements
  const heap: number[] = [];
  const comp = (n1: number, n2: number) =>
    (countMap.get(n1) || 0) - (countMap.get(n2) || 0);

  // Step 3: Insert elements into the heap and maintain the size of the heap to k
  countMap.forEach((_, key) => {
    heap.push(key);
    heap.sort(comp); // Maintain heap order after insertion
    if (heap.length > k) heap.shift(); // Remove the least frequent element if heap exceeds size k
  });

  // Step 4: The heap now contains the k most frequent elements; return them as the result
  return heap;
}
```

#### Big-O analysis

- **Time complexity: O(n log k)**. Maintaining the heap requires sorting up to `k` elements for each of the n unique elements, which takes O(n log k) in total.
- **Space complexity: O(n + k)**. The hash map requires O(n) space to store no more than `n` unique elements, and the heap requires O(k) space to store the top `k` elements.

### 3. Using Map

Another approach uses a frequency map to count occurrences of each number. A `buckets` array is then built to group elements by their frequencies, where the index corresponds to the frequency. Traversing the `buckets` array from highest frequency to lowest frequency efficiently collects the top `k` frequent elements without incurring an O(n log n) sorting step. This approach reduces the overall complexity to O(n).

#### Algorithm

1. Build a frequency map `frequencyMap` that maps each number to its frequency count .
2. Build a `buckets` array, where each index corresponds to a frequency and stores an array of numbers with that frequency.
3. Iterate through `buckets` from the highest frequency bucket to the lowest frequency bucket and select numbers until `k` is reached.

```ts
export default function mostCommonElements(
  numbers: number[],
  k: number,
): number[] {
  const frequencyMap: { [key: number]: number } = {};

  // Count the frequency of each number in the array
  for (let i = 0; i < numbers.length; i++) {
    frequencyMap[numbers[i]] = (frequencyMap[numbers[i]] || 0) + 1;
  }

  // Create an array of buckets where the index represents the frequency
  const buckets: number[][] = Array(numbers.length + 1)
    .fill(null)
    .map(() => []);

  // Place numbers into the corresponding bucket based on their frequency
  for (const num in frequencyMap) {
    const frequency = frequencyMap[num];
    buckets[frequency].push(Number(num));
  }

  const result: number[] = [];

  // Iterate from the highest frequency bucket to the lowest
  for (let i = buckets.length - 1; i >= 0 && k > 0; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        result.push(num);
        k--;
        if (k === 0) break;
      }
    }
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Counting frequencies and then populating buckets both run in O(n), followed by a final pass that selects at most `k` elements, still O(n).
- **Space complexity: O(n)**. The `frequencyMap` and `buckets` array each take up to O(n) space.

## Exercises

### Check your understanding 1

A min-priority structure stores the `k` most frequent distinct values seen so far. After inserting another value, its size becomes `k + 1`. Which value should be removed?

- [x] Remove the retained value with the lowest frequency.
  > Evicting the minimum frequency restores the size limit while preserving the best `k` candidates encountered so far.
- [ ] Remove the retained value with the highest frequency.
  > Discarding the highest-frequency candidate works against the goal of keeping the most frequent values.
- [ ] Remove whichever value first appeared in the input.
  > Input position does not determine frequency rank, and the output order is explicitly irrelevant.
- [ ] Always remove the value that was just inserted.
  > The new value may be more frequent than an existing candidate, so it must be compared by frequency before an eviction is chosen.

### Check your understanding 2

A frequency-bucket solution uses an array with `n + 1` buckets for `n` input values. Why are bucket indices frequencies rather than the values themselves, and what work makes this approach linear?

**Answer**

Values may be negative or large, but a present value’s frequency is between `1` and `n`. A frequency map creates one entry per distinct value; placing those entries into buckets takes at most n insertions. Scanning bucket indices downward visits at most n frequencies, and collecting the requested values visits at most n entries. No comparison sort is needed, and the map plus buckets use O(n) space.

**Checklist**

- Explains why frequencies have a bounded positive range.
- Counts both bucket scans and distinct-value insertions.
- Accounts for the frequency map and bucket space.

## Asked at these companies

- Netflix
