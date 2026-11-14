# Rate Limiter

**Difficulty:** Medium

## Description

Rate limiters decide whether each incoming task should be accepted based on how many recent accepted tasks are still inside a fixed time window.

In this question, implement `rateLimit(timestamps, maxAllowed, windowLen)` for a simplified batch setting. The input is a sorted list of task timestamps, and you should return a boolean array where each entry says whether that task is accepted.

This question is intentionally interview-scoped:

- The timestamps are already sorted in non-decreasing order.
- Only previously accepted tasks count against the limit.
- Rejected tasks do not consume slots in the window.
- You do not need real-time behavior, retries, token buckets, or per-user limits.

## Examples

```js
rateLimit([1, 3, 5, 6, 8, 9, 10], 2, 5);
// [true, true, false, true, true, false, false]
```

```js
rateLimit([1, 6, 7], 1, 5);
// [true, true, false]
```

In the second example, the task at time `6` is accepted because the accepted task at time `1` is exactly `5` units earlier, so it is outside the window.

```js
rateLimit([2, 2, 2], 2, 3);
// [true, true, false]
```

## Arguments

`rateLimit(timestamps, maxAllowed, windowLen)`

- `timestamps` (`number[]`): Sorted, non-decreasing integer timestamps for each task.
- `maxAllowed` (`number`): Maximum number of accepted tasks allowed inside the current sliding window.
- `windowLen` (`number`): Window length in the same time unit as `timestamps`.

## Returns

Returns a `boolean[]` of the same length as `timestamps`.

Each result is:

- `true` if the task is accepted.
- `false` if the task is rejected because the sliding window already contains `maxAllowed` previously accepted tasks.

## Notes

- A task at time `t` should count previously accepted tasks whose timestamps satisfy `t - previous < windowLen`.
- A task exactly `windowLen` units earlier does not count.
- Inputs are guaranteed valid.
- Do not mutate the input array.

## Files

| File | Contents |
| --- | --- |
| `rate-limiter.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
