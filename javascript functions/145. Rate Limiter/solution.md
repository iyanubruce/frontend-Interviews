# Rate Limiter — Solution

This is a sliding-window decision problem over accepted work, not all input timestamps. Rejected tasks produce `false` in the output, but they must not consume future capacity.

## Solution

The main state is the accepted timestamps that are still inside the current window. Since the input is already sorted, the decisions can be made in one pass.

Use a sliding window over accepted tasks only. The active queue should contain exactly the accepted timestamps that are still inside the current window and already counted toward the limit. Rejected tasks are decisions in the output, but they are not part of the limiter state.

The code tracks three pieces of state:

1. `acceptedTimestamps`: timestamps for tasks that have been accepted.
2. `head`: the first index in `acceptedTimestamps` that is still inside the current window.
3. `result`: the boolean decisions returned to the caller.

For each timestamp:

1. Before handling the current timestamp, evict accepted timestamps from the front while they are at least `windowLen` units older.
2. If the number of remaining accepted timestamps is less than `maxAllowed`, accept the task.
3. Only when the task is accepted, append its timestamp to the queue.

The active count is `acceptedTimestamps.length - head`. That is the number of accepted tasks whose timestamps satisfy `timestamp - previous < windowLen`, so it is the only count that should be compared with `maxAllowed`.

The code below uses an array plus a moving head index. This behaves like a queue without repeatedly shifting the whole array, so every accepted timestamp is appended once and skipped by `head` at most once.

For `rateLimit([1, 3, 5, 6, 8, 9, 10], 2, 5)`, the active queue contains only accepted timestamps:

| Timestamp | Active accepted timestamps before decision | Decision | Queue after decision |
| --- | --- | --- | --- |
| `1` | `[]` | accept | `[1]` |
| `3` | `[1]` | accept | `[1, 3]` |
| `5` | `[1, 3]` | reject | `[1, 3]` |
| `6` | `[3]` because `1` expired | accept | `[3, 6]` |
| `8` | `[6]` because `3` expired | accept | `[6, 8]` |
| `9` | `[6, 8]` | reject | `[6, 8]` |
| `10` | `[6, 8]` | reject | `[6, 8]` |

```ts
export default function rateLimit(
  timestamps: number[],
  maxAllowed: number,
  windowLen: number,
): boolean[] {
  const acceptedTimestamps: number[] = [];
  const result: boolean[] = [];
  let head = 0;

  for (const timestamp of timestamps) {
    // Move the head past accepted timestamps that are no longer inside the window.
    while (
      head < acceptedTimestamps.length &&
      timestamp - acceptedTimestamps[head] >= windowLen
    ) {
      head += 1;
    }

    const isAccepted = acceptedTimestamps.length - head < maxAllowed;
    result.push(isAccepted);

    // Only accepted tasks consume capacity in future windows.
    if (isAccepted) {
      acceptedTimestamps.push(timestamp);
    }
  }

  return result;
}
```

## Common pitfalls

- **Counting rejected tasks:** Rejected tasks do not consume slots, so they should not stay in the queue. Appending every input timestamp would make later tasks look rate-limited by previous rejections, which is not the behavior described in the prompt.
- **Off-by-one at the window boundary:** Accepted timestamps that are exactly `windowLen` units older should be removed before deciding the current task. The eviction condition is `timestamp - acceptedTimestamps[head] >= windowLen`, not `> windowLen`.
- **Shifting the array on every eviction:** Using `shift()` can produce the same decisions, but repeated shifts may make the one-pass solution slower because each shift can move the remaining array elements. A moving `head` keeps queue semantics while preserving linear processing.

## Notes

- Empty input returns an empty array.
- Multiple tasks can share the same timestamp; they are still processed in order.
- The input is sorted, so no sorting or reordering is needed.
- This is a batch sliding-window limiter, not a real-time throttle, retry system, token bucket, or per-user limiter.
- The moving `head` leaves expired timestamps in the backing array, but they are no longer counted.
- The queue stays sorted because accepted timestamps are appended in the same order as the sorted input; the eviction loop relies on that precondition.

## Techniques

- Sliding window.
- Queue or deque semantics.
- One-pass array processing.
