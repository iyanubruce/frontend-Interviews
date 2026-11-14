# Merge New Interval

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Binary search, Intervals, Sorting

> Source: [intervals-merge-new](https://www.greatfrontend.com/questions/algo/intervals-merge-new)

Given a sorted array of non-overlapping intervals `intervals`, where each interval is represented as `[start, end]` and sorted in ascending order by `start` times, insert a new interval `[start, end]` into the array. Ensure the resulting array remains sorted and free of overlapping intervals by merging any overlapping intervals as necessary. Intervals that share an endpoint are considered overlapping.

### Input

- `intervals: Array<[number, number]>`: An array of integer pairs
- `newInterval: [number, number]`: An integer pair representing `[start, end]`

| Input                                                                    | Output                          | Explanation                                                                                                                                                 |
| ------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intervals = [[1,2],[3,5],[6,10],[11,12],[13,16]], newInterval = [8,15]` | `[[1,2],[3,5],[6,16]]`          | The new interval [8, 15] overlaps with [6, 10], [11, 12], and [13, 16]. These intervals merge to form [6, 16], and the result is [[1, 2], [3, 5], [6, 16]]. |
| `intervals = [[1,2],[3,4],[5,6],[7,8]], newInterval = [2,5]`             | `[[1,6],[7,8]]`                 | The new interval [2, 5] overlaps with [1, 2], [3, 4], and [5, 6]. Merging them results in [1, 6].                                                           |
| `intervals = [[2,4],[6,8],[10,12]], newInterval = [15,17]`               | `[[2,4],[6,8],[10,12],[15,17]]` | The new interval [15, 17] does not overlap with any existing intervals and is simply added at the end.                                                      |

### Constraints

- 1 <= `intervals.length` <= 100
- `intervals[i].length == 2`
- 0 <= `start` <= `end` <= 10,000

## Hints

### What groups does the existing order create?

Relative to the new interval, the input splits into intervals entirely before it, intervals that overlap it, and intervals entirely after it.

### Can one overlap lead to another?

Yes. Each overlap may extend the inserted range far enough to reach a later interval, so compare against the range as it grows.

## Starter code

**TypeScript**

```ts
export default function mergeNewInterval(
  intervals: number[][],
  newInterval: number[],
): number[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
export default function mergeNewInterval(intervals, newInterval) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Linear Search

The approach merges a new interval into a list of non-overlapping intervals by performing a single linear scan. The intervals are processed in three distinct phases based on their relationship to the new interval: intervals that come completely before, intervals that overlap, and intervals that come completely after. Sorting is unnecessary because the input intervals are already sorted.

Intervals that do not overlap with the new interval are added to the result as-is. Overlapping intervals with the new interval are merged by updating the start and end of the new interval to cover the combined range. Once all overlapping intervals are merged, the new interval is added to the result, followed by the remaining intervals. This approach ensures that each interval is processed exactly once.

#### Algorithm

1. Initialize an empty result array `res` and set a pointer `i` to `0`.
2. Process intervals that come before the new interval:
3. While the end of the current interval is less than the start of the new interval, add the interval to `res`.
4. Increment the pointer `i` for each added interval.
5. Process overlapping intervals:
6. While the start of the current interval is less than or equal to the end of the new interval, merge the intervals by updating the start and end of the new interval.
7. Increment the pointer `i` after merging.
8. Add the merged interval (new interval) to the result array `res`.
9. Process intervals that come after the new interval:
10. Add all remaining intervals to `res` starting from the current pointer position `i`.
11. Increment the pointer `i` for each added interval.
12. Return the result array `res`.

```ts
export default function mergeNewInterval(
  intervals: number[][],
  newInterval: number[],
): number[][] {
  let n = intervals.length,
    i = 0,
    res = [];

  // Case 1: No overlapping before merging intervals
  // Add all intervals that come before the new interval (no overlap)
  while (i < n && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]);
    i++;
  }

  // Case 2: Overlapping and merging intervals
  // Merge all intervals that overlap with the new interval
  while (i < n && newInterval[1] >= intervals[i][0]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]); // Adjust the start of the new interval
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]); // Adjust the end of the new interval
    i++;
  }
  res.push(newInterval); // Add the merged interval to the result

  // Case 3: No overlapping after merging newInterval
  // Add all remaining intervals after the new interval
  while (i < n) {
    res.push(intervals[i]);
    i++;
  }

  return res;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each interval is processed exactly once, resulting in a linear runtime.
- **Space complexity: O(n)**. The result array `res` stores all intervals, requiring space proportional to the input size.

### 2. Using Binary Search

This approach combines binary search and merging to efficiently insert a new interval into a sorted list of intervals and merge any overlaps. Binary search is used to determine the correct position to insert the new interval based on its start time. Once inserted, a single pass through the intervals is sufficient to merge overlapping intervals. The merging process ensures that overlapping intervals are combined into a single interval by checking adjacent intervals in the result list.

#### Algorithm

1. Handle the edge case where the `intervals` array is empty by returning a list containing only the `newInterval`.
2. Use binary search to find the appropriate position to insert the `newInterval`:
3. Initialize two pointers, `left` and `right`, to represent the search range.
4. Compare the start value of the `newInterval` with the middle element of the current range.
5. Adjust the pointers until the position to insert the `newInterval` is found.
6. Insert the `newInterval` at the determined position using the `splice` method.
7. Initialize an empty array `res` to store the merged intervals.
8. Iterate through the `intervals` array:
9. If `res` is empty or the current interval does not overlap with the last interval in `res`, add the current interval to `res`.
10. If there is an overlap, merge the intervals by updating the end of the last interval in `res` to the maximum of the two overlapping intervals.
11. Return the `res` array containing the merged intervals.

```ts
export default function mergeNewInterval(
  intervals: number[][],
  newInterval: number[],
): number[][] {
  // If the intervals array is empty, return a list containing the newInterval
  if (intervals.length === 0) {
    return [newInterval];
  }

  let n = intervals.length;
  let target = newInterval[0]; // The start value of the new interval
  let left = 0,
    right = n - 1;

  // Binary search to find the position to insert newInterval
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (intervals[mid][0] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Insert newInterval at the found position
  intervals.splice(left, 0, newInterval);

  // Initialize the result array to hold merged intervals
  let res: number[][] = [];
  for (let interval of intervals) {
    // If res is empty or there is no overlap, add the interval to the result
    if (res.length === 0 || res[res.length - 1][1] < interval[0]) {
      res.push(interval);
      // If there is an overlap, merge the intervals by updating the end of the last interval in res
    } else {
      res[res.length - 1][1] = Math.max(res[res.length - 1][1], interval[1]);
    }
  }
  return res; // Return the merged intervals
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Binary search takes O(log n), but this is insignificant compared to the O(n) time required to merge the intervals.
- **Space complexity: O(n)**. The result array `res` requires space proportional to the input size.

## Exercises

### Check your understanding 1

A binary search locates where to insert a new interval into a sorted array in O(log n). The function must still return a materialized array of all resulting intervals. Why can the complete operation require O(n) time even when the new interval overlaps nothing?

**Answer**

If the new interval overlaps nothing, the output has n + 1 entries, so materializing a separate result requires linear work. Inserting into the existing contiguous array may also shift a linear number of entries. Binary search reduces the comparisons needed to locate the position; it does not remove the work of constructing or moving the output.

**Checklist**

- Uses output size as a source of linear work.
- Separates locating an insertion point from building the result.
- Recognizes the possible cost of shifting array entries.

### Check your understanding 2

The sorted, non-overlapping intervals are `[[1, 2], [4, 5], [7, 9]]`, and the new interval is `[2, 7]`. What should the insertion algorithm return when shared endpoints count as overlaps?

- [ ] `[[1, 2], [2, 7], [7, 9]]`
  > Both endpoint contacts are overlaps, so the new interval cannot remain separate from either neighboring interval.
- [x] `[[1, 9]]`
  > Merging with `[1, 2]` creates a growing span that also overlaps `[4, 5]` and `[7, 9]`, joining the entire chain.
- [ ] `[[1, 7], [7, 9]]`
  > Merging the first endpoint contact is insufficient because the growing span still shares endpoint `7` with the final interval.
- [ ] `[[1, 2], [4, 5], [7, 9]]`
  > The new interval adds coverage across existing gaps, so it cannot be discarded as though it were fully contained.
