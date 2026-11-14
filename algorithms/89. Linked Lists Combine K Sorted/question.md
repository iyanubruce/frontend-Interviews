# Linked Lists Combine K Sorted

**Difficulty:** Hard · **Duration:** ~45 min · **Topics:** Linked list, Heap

> Source: [linked-list-combine-k-sorted](https://www.greatfrontend.com/questions/algo/linked-list-combine-k-sorted)

Given an array of [linked lists](https://en.wikipedia.org/wiki/Linked_list), `lists`, where each linked list's node values are in **ascending order**, combine all these linked lists into a single sorted linked list and return the head node of the combined linked list.

The linked list is represented by a sequence of `ListNode`s, where each node points to the next node in the sequence, or `null` if it is the last node.

A `ListNode` has the following interface:

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}
```

### Input

- `lists: Array<ListNode | null>`: Array of head nodes of linked lists. An empty linked list is represented by `null`. Examples display each linked list as an array of values within the list

If every linked list is empty, return `null`.

| Input                                      | Output                       | Explanation                                                                         |
| ------------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------- |
| `lists = [[10,20,30],[5,15,25],[2,12,22]]` | `[2,5,10,12,15,20,22,25,30]` | The lists are combined into a single sorted list with elements in increasing order. |
| `lists = [[1],[3],[2]]`                    | `[1,2,3]`                    | Each list contains a single element, so they are combined into a sorted list.       |
| `lists = [[1,2,3],[4,5,6],[7,8,9]]`        | `[1,2,3,4,5,6,7,8,9]`        | All lists are already in ascending order and combined directly.                     |

### Constraints

- 1 <= `lists.length` <= 100
- 0 <= Number of nodes per list <= 100
- -10,000 <= `ListNode.val` <= 10,000

## Hints

### How can two sorted lists become one?

The next node must be at one of the two current heads. Choose the smaller one and advance only that list; when one ends, the other suffix is already in order.

### How should the merges be grouped?

Merging a growing result with every remaining list makes early nodes participate repeatedly. Pair lists, then pair the merged results in later rounds so the work stays balanced.

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineKSorted(
  lists: (ListNode | null)[],
): ListNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {(Node | null)[]} lists
 * @returns Node | null
 */
export default function linkedListCombineKSorted(lists) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute force approach

A naive approach is to extract all values from the `k` linked lists into an array, sorts them, and reconstructs a new sorted linked list from the sorted array.

#### Algorithm

1. Create an empty array `nodes` to store all the node values from the linked lists.
2. Create a dummy node to serve as the starting point for building the new linked list.
3. Iterate over each linked list in the `lists` array.
4. Traverse the current linked list.
5. Append each node's value to the `nodes` array.
6. Sort the `nodes` array in ascending order.
7. Iterate over the sorted `nodes` array.
8. Create a new node for each value and link it to the combined linked list.
9. Move the pointer to the newly added node.
10. Return the combined linked list, skipping the dummy node.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineKSorted(
  lists: (ListNode | null)[],
): ListNode | null {
  // Array to hold all node values from the linked lists
  let nodes: number[] = [];

  // Create a dummy node to serve as the starting point for the combined list
  let dummy: ListNode = { val: 0, next: null };
  let combinedHead: ListNode = dummy; // Head node to build the new combined list

  // Traverse each linked list in the input array
  lists.forEach((l) => {
    // Traverse the current linked list
    while (l) {
      // Collect all node values in the array
      nodes.push(l.val);
      l = l.next; // Move to the next node in the current list
    }
  });

  // Sort the collected node values in ascending order
  nodes
    .sort((a, b) => a - b)
    .forEach((n) => {
      // Create a new node with the sorted value and link it to the combined list
      combinedHead.next = { val: n, next: null };
      combinedHead = combinedHead.next; // Move the pointer to the newly added node
    });

  // Return the combined list, skipping the dummy node
  return dummy.next;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Extracting the values requires O(n), where `n` is the total number of nodes in all `k` linked lists. Sorting the array requires O(n log n).
- **Space complexity: O(n)**. Additional space is used to store the `nodes` array of size `n` and the new linked list.

### 2. Divide and conquer approach

Instead of trying to merge all `k` lists in one step, the divide and conquer approach breaks the problem into smaller parts. Adjacent lists are merged in pairs, reducing the number of lists by half in each round.

This process can be visualized as building a binary tree. At the bottom level, each of the `k` lists is treated as a separate node. At the next level, adjacent pairs of lists are merged to form `k/2` merged lists. This pairing and merging continue until there is only one list remaining, which forms the root of the tree.

Merge each pair by repeatedly choosing the smaller current head, processing all nodes in both lists.

The number of levels in the merge process corresponds to the height of the binary tree, which is proportional to `log k`. This hierarchical reduction significantly reduces the number of comparisons compared to a brute force approach.

#### Algorithm

1. Initialize `amount` as the number of linked lists to combine.
2. Set `interval` to 1, which represents the pairwise merge distance.
3. While `interval` is less than `amount`:
4. Iterate through the `lists` array, merging pairs of linked lists that are `interval` apart.
5. Replace the first list in each pair with the merged result.
6. Double the `interval`.
7. Return the first list in the `lists` array if `amount` is greater than 0; otherwise, return `null`.

The helper function `merge2Lists` performs the merging of two sorted linked lists:

1. Initialize a dummy node and a pointer to build the new combined list.
2. Traverse both input lists:
3. Compare the current nodes of both lists and append the smaller node to the combined list.
4. Move to the next node in the list from which the smaller node was chosen.
5. Attach any remaining nodes from the non-empty list to the combined list.
6. Return the combined list, skipping the dummy node.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineKSorted(
  lists: (ListNode | null)[],
): ListNode | null {
  let amount: number = lists.length; // Number of lists to combine
  let interval: number = 1; // Interval for merging lists in pairs

  // Continue combining in pairs, doubling the interval each time
  while (interval < amount) {
    // Merge lists in pairs
    for (let i = 0; i < amount - interval; i += interval * 2) {
      lists[i] = merge2Lists(lists[i], lists[i + interval]);
    }
    interval *= 2; // Double the interval
  }

  return amount > 0 ? lists[0] : null; // Return the combined list or null if there are no lists
}

// Helper function to combine two sorted linked lists
function merge2Lists(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  let head: ListNode = { val: 0, next: null }; // Dummy node to simplify the combining process
  let point: ListNode = head; // Pointer to build the new combined list

  // Merge the two lists while both are non-empty
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      point.next = l1; // Link the smaller node in the first list to the combined list
      l1 = l1.next; // Move to the next node in the first list
    } else {
      point.next = l2; // Link the smaller node in the second list to the combined list
      l2 = l1; // Move to the next node in the second list
      l1 = point.next.next; // Correct the next pointer of l1
    }
    point = point.next; // Move to the next node in the combined list
  }

  // If one of the lists is empty, link the remaining nodes from the other list
  if (!l1) {
    point.next = l2;
  } else {
    point.next = l1;
  }

  return head.next; // Return the head of the combined list, skipping the dummy node
}
```

#### Big-O analysis

- **Time complexity: O(n log k)**. Each merge operation for two lists is O(n), where `n` is the total number of nodes in the two lists. The number of merge levels is O(log k), where `k` is the number of lists.
- **Space complexity: O(1)**. The merging process is performed in-place without requiring additional space beyond the pointers.

## Exercises

### Check your understanding 1

Suppose there are `k` equally sized lists containing `N` nodes in total. Compare balanced pairwise merging with repeatedly merging the accumulated result into the next list. Why can the second strategy do much more work?

**Answer**

With balanced merging, each node participates in at most O(log k) rounds, and each round touches at most O(N) nodes, for O(N log k) work. In sequential merging, the growing result can be scanned again at every merge. With interleaved values that force long scans, the merged sizes are about 2N/k, 3N/k, ..., N; their sum is O(Nk). Sorted input makes an individual merge linear but does not prevent repeated work across an unbalanced schedule.

**Checklist**

- Count participation across rounds, not just the cost of one merge.
- Describe an input arrangement that makes sequential merges scan the growing result.
- Derive the different totals without assuming concatenation always scans every node.

### Check your understanding 2

An implementation builds a fresh array each round, merging indices `(0, 1)`, `(2, 3)`, and so on. It ignores an unpaired final list. Which input distinguishes this bug from a correct merge?

- [ ] `[[1, 4], [2, 3]]`
  > Both lists have partners, so no input list is discarded.
- [ ] `[[1], [2], []]`
  > Discarding the final empty list loses no nodes, so the output values still look correct.
- [x] `[[1], [2], [3]]`
  > The third list must survive the first round and participate later. Dropping it loses 3.
- [ ] `[[]]`
  > A loop that stops when one list remains performs no pairing round here.
