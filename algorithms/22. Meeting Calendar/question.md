# Meeting Calendar

**Difficulty:** Easy · **Duration:** ~35 min · **Topics:** Intervals, Sorting

> Source: [intervals-meeting-calendar](https://www.greatfrontend.com/questions/algo/intervals-meeting-calendar)

Given an array of meeting time `intervals` where each element represents a meeting time as `[start, end]`, determine whether a person can attend all the meetings without any overlap between meeting times. A meeting may start exactly when another meeting ends without overlapping it.

### Input

- A 2D array of integers `intervals` of size `n x 2`, where `n` is the number of meetings and each interval `[start, end]` represents a meeting starting at time start and ending at time end

| Input                                      | Output  | Explanation                                                                           |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------------- |
| `intervals = [[83,99]]`                    | `true`  | There is only one meeting, so there is no possibility of overlap.                     |
| `intervals = [[1,5],[5,10],[10,15]]`       | `true`  | The meetings are back-to-back but do not overlap.                                     |
| `intervals = [[8,10],[1,3],[2,6],[15,18]]` | `false` | The meetings [1, 3] and [2, 6] overlap, so it is not possible to attend all meetings. |

### Constraints

- 0 <= `intervals.length` <= 1,000
- `intervals[i].length` == 2
- 0 <= `start` < `end` <= 1,000,000

## Hints

### How can every conflict become adjacent?

Sort meetings by start time. Then it is enough to compare each start with the end of the meeting immediately before it.

## Starter code

**TypeScript**

```ts
export default function isMeetingCalendarValid(intervals: number[][]): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} numbers
 * @return {boolean}
 */
export default function isMeetingCalendarValid(intervals) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach

The naive approach is to check if a set of intervals can form a valid meeting calendar by verifying that no two intervals overlap. The key idea is to iterate through all pairs of intervals and compare their start and end times. For each pair, the overlap is determined by checking if one interval starts before the other ends and vice versa. If any overlap is detected, the calendar is considered invalid.

#### Algorithm

1. Define a helper function `overlap` that takes two intervals as input and checks if they overlap by comparing their start and end times.
2. Use nested loops to iterate through all pairs of intervals:
3. For each pair of intervals, call the `overlap` function.
4. If the function returns `true`, immediately return `false` as the intervals are not valid.
5. If no overlapping intervals are found after all comparisons, return `true`.

```ts
export default function isMeetingCalendarValid(intervals: number[][]): boolean {
  const overlap = (interval1: number[], interval2: number[]): boolean => {
    return (
      (interval1[0] >= interval2[0] && interval1[0] < interval2[1]) ||
      (interval2[0] >= interval1[0] && interval2[0] < interval1[1])
    );
  };

  // Iterate through each pair of intervals to check for overlaps
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (overlap(intervals[i], intervals[j])) {
        return false; // If any overlap is found, return false
      }
    }
  }
  return true; // If no overlaps are found, return true
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The algorithm iterates through all pairs of intervals, resulting in n(n - 1)/2 comparisons, which is O(n2).
- **Space complexity: O(1)**. The algorithm uses constant space as it does not require any additional data structures.

### 2. Using Sorting

This approach relies on sorting intervals by their start times to guarantee that overlapping intervals appear next to each other. Sorting ensures that intervals are ordered chronologically based on when they start. If two intervals overlap, the end time of an earlier interval will extend into the range of the next interval's start time. By arranging the intervals in ascending order of their start times, it becomes sufficient to check each interval against the next one in the sorted list to detect overlaps.

This method removes unnecessary comparisons present in the brute force approach. Instead of comparing every pair of intervals, only adjacent intervals in the sorted order need to be checked, as any overlapping intervals are guaranteed to be consecutive after sorting.

#### Algorithm

1. Sort the intervals based on their start times in ascending order using the `sort` method.
2. Iterate through the sorted intervals:
3. For each interval, check if its end time is greater than the start time of the next interval.
4. If an overlap is detected, return `false` as the calendar is invalid.
5. If the loop completes without detecting any overlaps, return `true`.

```ts
export default function isMeetingCalendarValid(intervals: number[][]): boolean {
  // Sort the intervals based on the start times
  intervals.sort((a, b) => a[0] - b[0]);

  // Iterate through the sorted intervals
  for (let i = 0; i < intervals.length - 1; i++) {
    // Check if the end time of the current interval is greater than the start time of the next interval
    if (intervals[i][1] > intervals[i + 1][0]) {
      return false; // If there is an overlap, return false
    }
  }

  // If no overlaps are found, return true
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the intervals dominates the runtime, taking O(n log n), while the linear scan through the intervals takes O(n), resulting in O(n log n) overall.
- **Space complexity: O(1)**. The algorithm uses constant space as it modifies the intervals array in place and does not require additional data structures.

## Exercises

### Check your understanding 1

After sorting meetings by start time, the algorithm checks only adjacent meetings. Why is passing all of those checks enough to rule out a conflict between non-adjacent meetings?

**Answer**

If every adjacent pair passes, each meeting ends no later than the next meeting starts. The start times are sorted, so that end is also no later than every later start. Therefore an earlier meeting cannot overlap any later meeting, not just its immediate neighbor. Sorting is essential to that implication; adjacency in arbitrary input order says nothing about time order.

**Checklist**

- Uses the end-before-next-start condition.
- Extends it to all later starts using sorted order.
- Explains why unsorted adjacency checks are insufficient.

### Check your understanding 2

Can one person attend every meeting in `[[5, 8], [1, 3], [3, 5]]`?

- [ ] No, because the meetings are not supplied in chronological order.
  > Input order does not determine feasibility because the algorithm sorts meetings by start time before checking them.
- [ ] No, because two pairs of meetings share endpoints.
  > A meeting may start exactly when the previous one ends, so shared boundaries do not create conflicts.
- [x] Yes, because sorting gives `[1, 3]`, `[3, 5]`, and `[5, 8]` with no positive-duration overlap.
  > Each start is at least the preceding end, allowing all three meetings to be attended back to back.
- [ ] Yes, but only the first two meetings after sorting are checked.
  > Every adjacent pair must be checked because a conflict can occur later in the sorted schedule.
