# Task Coordination

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Greedy, Heap

> Source: [task-coordination](https://www.greatfrontend.com/questions/algo/task-coordination)

Given a list of tasks, each represented by a letter (from A to Z), and a cooldown period `k`. The cooldown period specifies that the same task must be separated by at least `k` intervals between executions.

Determine the minimum number of intervals required to complete all tasks, while ensuring that the same task is not executed again before the cooldown period has passed.

### Input

- `tasks: string[]`: An array of characters, where each task is represented as a letter (A-Z)
- `k: number`: An integer representing the cooldown period, the minimum number of intervals between two executions of the same task

| Input                                      | Output | Explanation                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tasks = ["A","A","A","B","B","B"], k = 2` | `8`    | Task 'A' appears 3 times and task 'B' appears 3 times. Since there is a cooldown of 2, we need to ensure that after every 'A' there are at least 2 other tasks or idle intervals before we can add another 'A'. The same applies to 'B'. A valid sequence might look like this: 'A' -> 'B' -> idle -> 'A' -> 'B' -> idle -> 'A' -> 'B'. Thus, the total number of intervals required is 8. |
| `tasks = ["A","C","A","B","D","B"], k = 1` | `6`    | The tasks 'A' and 'B' each appear twice, but the cooldown is only 1. After completing one 'A', we can immediately complete another 'A' after just one other task. A valid sequence could look like this: 'A' -> 'C' -> 'A' -> 'B' -> 'D' -> 'B'. Thus, the total number of intervals required is 6.                                                                                        |
| `tasks = ["A","A","A","B","B","B"], k = 3` | `10`   | The cooldown is 3, meaning after completing a task, we must wait for 3 intervals before repeating the same task. A valid sequence could be: 'A' -> 'B' -> idle -> idle -> 'A' -> 'B' -> idle -> idle -> 'A' -> 'B'. Thus, the total number of intervals needed is 10.                                                                                                                      |

### Constraints

- 1 <= `tasks.length` <= 1,000
- `tasks[i]` is an uppercase English letter
- 0 <= `k` <= 100

## Hints

### Which task constrains the schedule most?

Arrange `A A A B C` with a cooldown of `2`. The repeated `A`s create gaps that cannot be shortened; how large a schedule do those gaps force before you decide what fills them?

### What changes when frequencies tie?

Now arrange `A A A B B B` with the same cooldown. Several task types can occupy the ends of the repeated blocks, so account for all of the tasks tied for the highest frequency.

### When do the gaps need no idle time?

Other task types may fill every open position in the frame. Compare the frame's lower bound with the number of tasks themselves, which one controls the answer in each case?

## Starter code

**TypeScript**

```ts
export default function taskCoordinator(tasks: string[], k: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string[]} tasks
 * @param {number} k
 * @return {number}
 */
export default function taskCoordinator(tasks, k) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Greedy Approach

This solution minimizes the time required to execute a series of tasks with a cooldown period `k`, ensuring that no two identical tasks are executed within `k` intervals. The core idea is to focus on tasks with the highest frequency since they dominate the scheduling process. These tasks must be distributed as evenly as possible, creating "partitions" in the schedule. The remaining tasks fill the gaps between these partitions, reducing idle time.

Tasks with the highest frequency define the framework of the schedule because their distribution determines the placement of all other tasks. Each occurrence of these tasks is separated by at least `k` intervals. If there are other tasks to fill these gaps, idle periods are reduced; otherwise, idle slots remain, increasing the total time.

#### Algorithm

1. Initialize an array `counter` of size 26 to count the frequency of each task.
2. Traverse the `tasks` array to populate the `counter` array:
3. For each task, increment its frequency count in `counter`.
4. Update `maximum` to track the highest frequency of any task.
5. Update `maxCount` to count how many tasks have this maximum frequency.
6. Compute the number of partitions as `maximum - 1`.
7. Compute the length of each partition as `k - (maxCount - 1)`.
8. Calculate the total number of empty slots as `partCount * partLength`.
9. Compute the number of available tasks as the total number of tasks minus the tasks with maximum frequency.
10. Calculate the number of idle slots as `Math.max(0, emptySlots - availableTasks)`.
11. Return the total time required as `tasks.length + idles`.

```ts
export default function taskCoordinator(tasks: string[], k: number): number {
  // Array to store the frequency of each task (26 letters, A-Z)
  const counter: number[] = new Array(26).fill(0);
  let maximum = 0; // Maximum frequency of any task
  let maxCount = 0; // Number of tasks with maximum frequency

  // Traverse through tasks to calculate task frequencies
  for (const task of tasks) {
    const index = task.charCodeAt(0) - "A".charCodeAt(0);
    counter[index]++;

    if (maximum === counter[index]) {
      maxCount++;
    } else if (maximum < counter[index]) {
      maximum = counter[index];
      maxCount = 1;
    }
  }

  // Calculate idle slots, available tasks, and idles needed
  const partCount = maximum - 1;
  const partLength = k - (maxCount - 1);
  const emptySlots = partCount * partLength;
  const availableTasks = tasks.length - maximum * maxCount;
  const idles = Math.max(0, emptySlots - availableTasks);

  // Return the total time required
  return tasks.length + idles;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Traversing the `tasks` array and updating the `counter` array each take linear time.
- **Space complexity: O(1)**. The `counter` array has a fixed size of 26, regardless of the input size.

### 2. Using Heap

The key idea is to minimize idle time by always executing the most frequent tasks first. A max heap is used to efficiently retrieve the task with the highest remaining frequency. This ensures that tasks with higher frequencies are executed earlier, reducing the likelihood of idle cycles.

#### Algorithm

1. Build a frequency map to count the occurrences of each task.
2. Populate a max heap with the task frequencies. The heap is structured to prioritize the highest frequency tasks.
3. Initialize the total time counter to `0`.
4. While the heap is not empty:
5. Execute tasks for a single cooldown cycle (`k + 1` times) or until the heap is empty.
6. Decrease the frequency of executed tasks and store updated frequencies.
7. After the cycle, reinsert the updated task frequencies back into the heap.
8. Update the total time counter. If the heap is empty after a cycle, add only the tasks executed during the cycle; otherwise, add `k + 1` time units for the full cycle.
9. Return the total time counter as the result.

```ts
export default function leastInterval(tasks: string[], k: number): number {
  // Building frequency map
  const freq: number[] = new Array(26).fill(0);
  for (const ch of tasks) {
    freq[ch.charCodeAt(0) - "A".charCodeAt(0)]++;
  }

  // Max heap to store frequencies
  const pq: number[] = [];

  // Helper function to maintain the max heap property
  function heapPush(value: number) {
    pq.push(value);
    let index = pq.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (pq[index] > pq[parentIndex]) {
        [pq[index], pq[parentIndex]] = [pq[parentIndex], pq[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  function heapPop(): number {
    const top = pq[0];
    const last = pq.pop()!;

    if (pq.length > 0) {
      pq[0] = last;
      let index = 0;

      while (true) {
        const leftIndex = index * 2 + 1;
        const rightIndex = leftIndex + 1;
        let largestIndex = index;

        if (leftIndex < pq.length && pq[leftIndex] > pq[largestIndex]) {
          largestIndex = leftIndex;
        }
        if (rightIndex < pq.length && pq[rightIndex] > pq[largestIndex]) {
          largestIndex = rightIndex;
        }
        if (largestIndex === index) {
          break;
        }

        [pq[index], pq[largestIndex]] = [pq[largestIndex], pq[index]];
        index = largestIndex;
      }
    }

    return top;
  }

  // Populate the max heap with frequencies
  for (const count of freq) {
    if (count > 0) {
      heapPush(count);
    }
  }

  let time = 0;
  // Process tasks until the heap is empty
  while (pq.length > 0) {
    let cycle = k + 1;
    const store: number[] = [];
    let taskCount = 0;

    // Execute tasks in each cycle
    while (cycle-- > 0 && pq.length > 0) {
      const top = heapPop();
      if (top > 1) {
        store.push(top - 1);
      }
      taskCount++;
    }

    // Restore updated frequencies to the heap
    for (const x of store) {
      heapPush(x);
    }

    // Add time for the completed cycle
    time += pq.length === 0 ? taskCount : k + 1;
  }

  return time;
}
```

#### Big-O analysis

- **Time complexity: O(n log k)**. Iterating through the `tasks` array and building the frequency map is O(n). Operations on the heap (insertion and deletion) are O(log k), where `k` is the number of unique tasks.
- **Space complexity: O(k)**. The heap and the frequency map require storage proportional to the number of unique tasks, which is `k`.

## Exercises

### Check your understanding 1

Consider the proposed answer `(f - 1) * (k + 1) + 1`, where f is the highest task frequency. Explain two different reasons it can be too small: use `[A, A, B, B]` with k = 2, and `[A, A, B, B, C, C]` with k = 1.

**Answer**

For AABB, f = 2 and the proposed result is 4, but both A and B share the maximum frequency. A valid shortest schedule is A, B, idle, A, B, of length 5. The final block needs q = 2 tied task types, giving (f - 1)(k + 1) + q. For AABBCC with k = 1, even that corrected frame has length 5, but six tasks need at least six intervals; A, B, C, A, B, C achieves 6. Take the maximum of task count and corrected frame length, rather than adding the two bounds.

**Checklist**

- Account for every task type tied at the maximum frequency.
- Use one execution interval per task as a separate lower bound.
- Exhibit schedules meeting the bound for both examples.

### Check your understanding 2

Tasks are `["A", "A", "A", "B", "B", "C"]`, and identical tasks require `2` intervals between executions. What is the minimum number of intervals needed?

- [ ] `6`
  > Six intervals would leave no room to separate all three `A` executions by two intervening intervals.
- [ ] `8`
  > Only the first two `A` executions create following cooldown gaps, and available tasks fill all but one required slot, so two idles are unnecessary.
- [ ] `5`
  > Every one of the six tasks requires its own execution interval before any cooldown idles are considered.
- [x] `7`
  > A compact schedule such as `A, B, C, A, B, idle, A` respects both cooldown gaps and uses exactly one idle interval.
