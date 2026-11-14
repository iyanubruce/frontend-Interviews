# Disjoint Intervals

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Intervals, Greedy

> Source: [disjoint-intervals](https://www.greatfrontend.com/questions/algo/disjoint-intervals)

Given an array of `intervals` where each interval is represented as `[start, end]`. Each pair denotes the start and end of an interval on a number line. For example, `[1, 3]` represents an interval that starts at 1 and ends at 3.

Find the minimum number of intervals that need to be removed so that the remaining intervals are disjoint.

Intervals are considered disjoint when one interval ends at or before another begins. Touching endpoints do not count as an overlap. For example:

- `[1, 3]` and `[4, 6]` are disjoint because they do not share any common points
- `[1, 3]` and `[3, 6]` are disjoint because endpoint-touching is allowed
- `[1, 5]` and `[4, 6]` are not disjoint because they overlap at points between 4 and 5

### Input

- `intervals: Array<[number, number]>`: An array of integer pairs

| Input                                            | Output | Explanation                                                                                                                                                                                      |
| ------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `intervals = [[1,5],[2,3],[3,4],[4,6]]`          | `1`    | [1,5] overlaps with multiple intervals, and removing it makes the rest non-overlapping. Since only one interval needs to be removed, the result is 1.                                            |
| `intervals = [[1,15],[3,5],[6,8],[8,10],[9,11]]` | `2`    | [1,15] overlaps with all other intervals, and [9,11] overlaps with [8,10]. Removing these two intervals makes the rest non-overlapping. Since two intervals need to be removed, the result is 2. |
| `intervals = [[1,4],[4,8]]`                      | `0`    | [1,4] and [4,8] are already non-overlapping, so no intervals need to be removed. Hence, the result is 0.                                                                                         |

### Constraints

- 0 <= `intervals.length` <= 100
- `intervals[i].length == 2`
- 0 <= `start` <= `end` <= 10,000

## Hints

### What is the opposite of minimizing removals?

Maximize the number of intervals that remain. Among overlapping choices, which one leaves the most room for intervals that come later?

### Which endpoint should determine the order?

Keeping the compatible interval that ends earliest cannot make a later interval harder to fit.

## Starter code

**TypeScript**

```ts
export default function disjointIntervals(intervals: number[][]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} intervals
 * @return {number}
 */
export default function disjointIntervals(intervals) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Greedy Approach

The problem is to find the minimum number of intervals to remove so that the remaining intervals are non-overlapping. The greedy approach optimizes this by always choosing the interval with the earliest ending time, as this leaves the most room for subsequent intervals. Sorting by the second element ensures that intervals with the smallest end times are prioritized.

#### Algorithm

1. Define a helper function `compareSecondElement` to compare the second elements of two intervals and return their difference.
2. Sort the input `intervals` array using the `compareSecondElement` function.
3. Initialize `ans` to track the number of intervals removed and `k` to track the end time of the last non-overlapping interval.
4. Iterate through each interval in the sorted list:
5. Extract the start (`x`) and end (`y`) of the current interval.
6. If the start of the current interval is greater than or equal to `k`: - Update `k` to the end time of the current interval as there is no overlap.
7. Otherwise, increment `ans` as the interval overlaps and needs to be removed.
8. Return `ans`, which holds the count of intervals removed to make the intervals disjoint.

```ts
const compareSecondElement = (a: number[], b: number[]): number => {
  return a[1] - b[1]; // Return the difference between the second elements
};

export default function disjointIntervals(intervals: number[][]): number {
  // Sort intervals by the second element
  intervals.sort(compareSecondElement);

  // Initialize answer to count overlaps and k to track the end of the last interval
  let ans = 0;
  let k = Number.MIN_SAFE_INTEGER;

  // Iterate through the intervals
  for (const interval of intervals) {
    const x = interval[0];
    const y = interval[1];

    if (x >= k) {
      // Case 1: No overlap, update k to the end of the current interval
      k = y;
    } else {
      // Case 2: Overlap, increment the answer
      ans++;
    }
  }

  // Return the number of overlaps
  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the intervals takes O(n log n), and the subsequent iteration through the intervals takes O(n).
- **Space complexity: O(1)**. The algorithm operates in constant space as it processes the input array in-place.

## Exercises

### Check your understanding 1

Suppose an optimal set of compatible intervals starts with an interval ending at time `e`. The earliest-finishing interval ends at `g <= e`. Why can replacing the first choice with that interval preserve the number of intervals kept?

**Answer**

Every later interval in the optimal set starts at or after e. Since g is no later than e, each of those later intervals is still compatible with the replacement. The replacement keeps the same number of intervals and leaves at least as much room afterward. Repeating this argument on the remaining compatible intervals justifies the earliest-finish choice.

**Checklist**

- Uses the end-time ordering `g <= e`.
- Shows that every later kept interval remains compatible.
- Connects replacement without lost intervals to greedy optimality.

### Check your understanding 2

The intervals `[[1, 4], [2, 3], [3, 5]]` are processed by sorting on end time and greedily keeping compatible intervals. How many intervals are removed?

- [ ] Remove `0` intervals.
  > The intervals `[1, 4]` and `[2, 3]` overlap, so all three cannot remain.
- [x] Remove `1` interval.
  > The scan keeps `[2, 3]`, removes the overlapping `[1, 4]`, and then keeps `[3, 5]` because sharing the endpoint `3` is allowed.
- [ ] Remove `2` intervals.
  > Two compatible intervals can remain, so removing all but one is unnecessary.
- [ ] Remove `3` intervals.
  > A nonempty compatible subset exists, and the objective never requires deleting every interval.
