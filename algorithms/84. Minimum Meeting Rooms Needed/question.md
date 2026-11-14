# Minimum Meeting Rooms Needed

**Difficulty:** Medium · **Duration:** ~55 min · **Topics:** Heap, Intervals

> Source: [intervals-minimum-meeting-rooms](https://www.greatfrontend.com/questions/algo/intervals-minimum-meeting-rooms)

Given an array of meeting time `intervals`, where each interval is represented as `[start, end]` which represents a meeting starting at time `start` and ending at time `end`, determine the minimum number of meeting rooms required to accommodate all the meetings without any overlap. A room can be reused when one meeting starts exactly when another meeting ends.

### Input

- `intervals: Array<[number, number]>`: An array of integers pairs

| Input                                  | Output | Explanation                                                                                                                                                                                                                                |
| -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `intervals = [[83,99]]`                | `1`    | Since there is only one meeting, only one room is required. There is no overlap, so just one room can accommodate the meeting.                                                                                                             |
| `intervals = [[1,5],[2,6],[8,9]]`      | `2`    | There are two overlapping meetings: [1, 5] and [2, 6]. To accommodate both meetings simultaneously, at least two rooms are needed. The other meeting [8, 9] do not overlap with the earlier ones, so only two rooms are required in total. |
| `intervals = [[5,10],[10,15],[15,20]]` | `1`    | The meetings are back-to-back, meaning they do not overlap. Since the end of one meeting coincides with the start of the next, only one room is sufficient to host all the meetings.                                                       |

### Constraints

- 0 <= `intervals.length` <= 1,000
- `intervals[i].length` == 2
- 0 <= `start` < `end` <= 1,000,000

## Hints

### What quantity determines the answer?

The required room count is the largest number of meetings active at once. Think of each start as adding one active meeting and each end as removing one.

### How can starts and ends be processed in order?

Sort the two kinds of times and compare the next event from each. At a tie, the ending meeting frees its room before the new one begins.

## Starter code

**TypeScript**

```ts
export default function minMeetingRoomsNeeded(intervals: number[][]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} intervals
 * @return {number}
 */
export default function minMeetingRoomsNeeded(intervals) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Two Pointer Approach

This approach determines the minimum number of meeting rooms needed by separating and sorting the start and end times of the intervals. By using two pointers, one for the `start` times and one for the `end` times, the algorithm efficiently tracks the number of concurrent meetings.

The intuition is that a meeting room becomes free when a meeting ends, which is represented by the `endPointer`. For each meeting start (`startPointer`), the algorithm checks if the meeting can reuse an available room (by comparing the start time with the earliest end time). If a room is free, the `endPointer` is moved forward to mark the room as available. Otherwise, a new room is allocated.

Sorting the start and end arrays lets two pointers track room availability without checking every pair of meetings.

#### Algorithm

1. Handle the base case by returning `0` if the `intervals` array is empty.
2. Create two arrays, `start` and `end`, to store the start and end times of each interval.
3. Populate the `start` and `end` arrays by iterating through the `intervals` array.
4. Sort both `start` and `end` arrays in ascending order.
5. Initialize two pointers, `startPointer` and `endPointer`, to traverse the `start` and `end` arrays respectively. Also, initialize a variable `usedRooms` to track the number of rooms currently in use.
6. Iterate through the `start` array:
7. If the start time of the current meeting is greater than or equal to the earliest end time (indicated by `end[endPointer]`), free a room by decrementing `usedRooms` and moving `endPointer` forward.
8. Allocate a room for the current meeting by incrementing `usedRooms`.
9. Move the `startPointer` forward to process the next meeting.
10. Return the value of `usedRooms`, which represents the maximum number of rooms needed at any time.

```ts
export default function minMeetingRoomsNeeded(intervals: number[][]): number {
  // Check for the base case. If there are no intervals, return 0
  if (intervals.length === 0) {
    return 0;
  }

  // Separate start and end times into their own arrays
  const start: number[] = new Array(intervals.length);
  const end: number[] = new Array(intervals.length);

  for (let i = 0; i < intervals.length; i++) {
    start[i] = intervals[i][0];
    end[i] = intervals[i][1];
  }

  // Sort the start and end times
  start.sort((a, b) => a - b);
  end.sort((a, b) => a - b);

  // The two pointers in the algorithm: endPointer and startPointer
  let startPointer = 0,
    endPointer = 0;

  // Variable to keep track of the maximum number of rooms used
  let usedRooms = 0;

  // Iterate over the intervals
  while (startPointer < intervals.length) {
    // If there is a meeting that has ended by the time the meeting at startPointer starts
    if (start[startPointer] >= end[endPointer]) {
      usedRooms -= 1;
      endPointer += 1;
    }

    // Regardless of whether a room frees up or not, we allocate a room for the current meeting
    usedRooms += 1;
    startPointer += 1;
  }

  return usedRooms;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the `start` and `end` arrays dominates the runtime, while the linear scan to process the intervals takes O(n).
- **Space complexity: O(n)**. Two additional arrays, `start` and `end`, are used to store the start and end times of the intervals.

### 2. Using Priority Queue (Min-Heap)

The approach uses a min heap to efficiently track the end times of ongoing meetings, ensuring that the earliest finishing meeting is always processed first. This allows determining if a room becomes free when a new meeting starts. Sorting the intervals by start time ensures that meetings are processed in chronological order.

A min heap is used because it supports efficient insertion and extraction of the smallest element. At any point, the heap contains the end times of all active meetings. When a meeting starts, its start time is compared to the smallest end time in the heap (the meeting that finishes the earliest). If the new meeting can reuse the room (its start time is greater than or equal to the smallest end time), the end time is removed from the heap. Otherwise, a new room is allocated, and the meeting's end time is added to the heap.

#### Algorithm

1. Handle the base case by returning `0` if the `intervals` array is empty.
2. Sort the `intervals` array by the start times of the meetings in ascending order.
3. Initialize a min heap (`allocator`) to store the end times of meetings currently occupying rooms.
4. Add the end time of the first meeting to the heap.
5. Iterate through the remaining intervals:
6. If the current meeting's start time is greater than or equal to the smallest end time in the heap, remove the smallest end time from the heap (indicating a room is freed).
7. Add the current meeting's end time to the heap, allocating a room for it.
8. After processing all intervals, the size of the heap represents the minimum number of rooms required, as each element in the heap corresponds to a currently active meeting.
9. Return the size of the heap.

```ts
// Importing the PriorityQueue from a suitable library
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

export default function minMeetingRoomsNeeded(intervals: number[][]): number {
  // Check for the base case. If there are no intervals, return 0
  if (intervals.length === 0) {
    return 0;
  }

  // Min heap to track the end time of meetings
  const allocator = new MinPriorityQueue<number>();

  // Sort the intervals by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Add the first meeting's end time to the heap
  allocator.enqueue(intervals[0][1]);

  // Iterate over remaining intervals
  for (let i = 1; i < intervals.length; i++) {
    // If the room due to free up the earliest is free, assign that room to this meeting
    if (intervals[i][0] >= allocator.front()) {
      allocator.dequeue();
    }

    // Add the current meeting's end time to the heap
    allocator.enqueue(intervals[i][1]);
  }

  // The size of the heap tells us the minimum rooms required for all the meetings
  return allocator.size();
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the intervals takes O(n log n), and each insertion and removal operation in the heap takes O(log n), resulting in O(n log n) for heap operations over all intervals.
- **Space complexity: O(n)**. The min heap can contain up to `n` elements in the worst case.

## Exercises

### Check your understanding 1

Consider a variant that removes every ended meeting from its min-heap before adding the next meeting. Its heap therefore contains only currently active meetings. For `[[0, 2], [0, 2], [3, 4]]`, why is returning the final heap size insufficient?

**Answer**

Two meetings overlap from time `0` to `2`, so two rooms are necessary. Both are removed before time `3`; after inserting the last meeting, the heap size is only one. This active-meetings variant must remember the largest heap size reached. That differs from a room-allocation heap that reuses one room per start and retains an entry for each allocated room.

**Checklist**

- Identifies the earlier peak of two meetings.
- Explains why the final active heap has size one.
- Tracks the maximum under the stated active-meetings invariant.

### Check your understanding 2

How many meeting rooms are required for `[[0, 5], [1, 2], [2, 4], [5, 7]]` when a room can be reused by a meeting that starts exactly as another ends?

- [ ] `1` room
  > The meetings `[0, 5]` and `[1, 2]` overlap, so at least two rooms are needed.
- [ ] `3` rooms
  > The meeting starting at `2` can reuse the room released at `2`, so concurrency never reaches three.
- [ ] `4` rooms
  > Counting every meeting separately ignores that rooms are released and reused as meetings end.
- [x] `2` rooms
  > Peak concurrency is two; the starts at `2` and `5` each coincide with an end and can reuse the newly available room.

## Asked at these companies

- Ethos
