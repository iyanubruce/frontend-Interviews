# Linked Lists Combine Two Sorted

**Difficulty:** Easy · **Duration:** ~35 min · **Topics:** Linked list

> Source: [linked-list-combine-two-sorted](https://www.greatfrontend.com/questions/algo/linked-list-combine-two-sorted)

Given two [linked lists](https://en.wikipedia.org/wiki/Linked_list), `listA` and `listB`, whose node values are in **ascending order**, combine both linked lists into a single sorted linked list and return the head node of the combined linked list.

The linked list is represented by a sequence of `ListNode`s, where each node points to the next node in the sequence, or `null` if it is the last node.

A `ListNode` has the following interface:

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}
```

### Input

- `listA: ListNode | null`: Head node of the first linked list, or `null` if the list is empty. Examples display each linked list as an array of values within the list
- `listB: ListNode | null`: Head node of the second linked list, or `null` if the list is empty. Examples display each linked list as an array of values within the list

If both linked lists are empty, return `null`.

| Input                                         | Output                     | Explanation                                                                                                                        |
| --------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `listA = [-3,-1,9,10], listB = [-10,3,4,6,9]` | `[-10,-3,-1,3,4,6,9,9,10]` | Combining the sorted lists [-3, -1, 9, 10] and [-10, 3, 4, 6, 9] results in a single sorted list [-10, -3, -1, 3, 4, 6, 9, 9, 10]. |
| `listA = [1,2,4], listB = [1,3,4]`            | `[1,1,2,3,4,4]`            | Combining the sorted lists [1, 2, 4] and [1, 3, 4] results in a single sorted list [1, 1, 2, 3, 4, 4].                             |
| `listA = [], listB = [0]`                     | `[0]`                      | Combining the empty list [] with the sorted list [0] results in the list [0].                                                      |

### Constraints

- 0 <= Number of nodes per list <= 50
- -100 <= `ListNode.val` <= 100

## Hints

### Where can the next smallest node be?

It must be at one of the two current heads. After attaching the smaller one, only that list advances; once a list ends, the other suffix can be attached as it is.

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineTwoSorted(
  listA: ListNode | null,
  listB: ListNode | null,
): ListNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {ListNode | null} listA
 * @param {ListNode | null} listB
 * @return {ListNode | null}
 */
export default function linkedListCombineTwoSorted(listA, listB) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Iterative Method

The iterative approach for merging two sorted linked lists focuses on maintaining efficiency by using the already sorted nature of the input lists. The strategy involves traversing both lists simultaneously, comparing their current nodes, and building the combined list node by node. This ensures that the merged list remains sorted without requiring additional sorting steps.

#### Algorithm

1. Create a `dummy` node with a placeholder value and set `prev` to point to `dummy`.
2. While both `listA` and `listB` are non-`null`:
3. Compare the current nodes of `listA` and `listB`.
4. Append the smaller node to the merged list by updating `prev.next`.
5. Move the pointer of the list from which the smaller node was taken to its next node.
6. Update `prev` to point to the last node in the merged list.
7. After exiting the loop, append the remaining nodes of either `listA` or `listB` (whichever is non-`null`) to the merged list.
8. Return `dummy.next`, which points to the head of the merged list.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineTwoSorted(
  listA: ListNode | null,
  listB: ListNode | null,
): ListNode | null {
  // Dummy node to act as the previous node to the head of the combined list
  let dummy: ListNode = { val: -1, next: null };

  // Pointer to the last node in the combined list, initially set to dummy
  let prev: ListNode = dummy;

  // Iterate while both listA and listB are not null
  while (listA !== null && listB !== null) {
    // Compare the values of listA and listB nodes
    if (listA.val <= listB.val) {
      // If listA node is smaller or equal, add it to the combined list
      prev.next = listA;
      listA = listA.next; // Move to the next node in listA
    } else {
      // If listB node is smaller, add it to the combined list
      prev.next = listB;
      listB = listB.next; // Move to the next node in listB
    }
    // Move prev to the next node in the combined list
    prev = prev.next!;
  }

  // At least one of listA and listB can still have nodes, add the remaining nodes to the combined list
  if (listA !== null) {
    prev.next = listA;
  } else {
    prev.next = listB;
  }

  // The combined list is next to the dummy node
  return dummy.next;
}
```

#### Big-O analysis

- **Time complexity: O(m + n)**. Each node in both lists is processed exactly once.
- **Space complexity: O(1)**. The algorithm uses only a constant amount of extra space.

### 2. Using Recursive Method

The recursive approach for merging two sorted linked lists relies on using recursion to simplify the process of combining the lists. The strategy involves comparing the current nodes of the two lists and making recursive calls to merge the rest of the lists. This ensures that the merged list is built in a sorted order as the recursion is called.

At each step, the algorithm compares the current nodes of `listA` and `listB`. The smaller of the two nodes is chosen as the head of the merged list. This process is repeated recursively for the remaining nodes in the lists.

The recursion terminates when either `listA` or `listB` becomes `null`. At this point, the non-`null` list is appended to the merged list since it is already sorted.

The recursive approach effectively reduces the problem size at each step by processing one node at a time. Each node is processed exactly once, ensuring that the algorithm is linear with respect to the total number of nodes.

#### Algorithm

1. Check if `listA` is `null`. If it is, return `listB` as the merged list.
2. Check if `listB` is `null`. If it is, return `listA` as the merged list.
3. Compare the values of the current nodes in `listA` and `listB`.
4. If `listA.val` is less than `listB.val`: - Set `listA.next` to the result of recursively merging `listA.next` and `listB`. - Return `listA` as the head of the merged list.
5. If `listB.val` is less than or equal to `listA.val`: - Set `listB.next` to the result of recursively merging `listA` and `listB.next`. - Return `listB` as the head of the merged list.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListCombineTwoSorted(
  listA: ListNode | null,
  listB: ListNode | null,
): ListNode | null {
  // If listA is null, return listB because the combined list is just listB
  if (listA === null) {
    return listB;
  }

  // If listB is null, return listA because the combined list is just listA
  if (listB === null) {
    return listA;
  }

  // If listA's value is less than listB's value
  if (listA.val < listB.val) {
    // Recursively combine listA.next and listB, and set the next of listA to the combined list
    listA.next = linkedListCombineTwoSorted(listA.next, listB);
    // Return listA as the head of the combined list
    return listA;
  }

  // If listB's value is less than or equal to listA's value
  // Recursively combine listA and listB.next, and set the next of listB to the combined list
  listB.next = linkedListCombineTwoSorted(listA, listB.next);

  // Return listB as the head of the combined list
  return listB;
}
```

#### Big-O analysis

- **Time complexity: O(m + n)**. Each node in both lists is visited exactly once.
- **Space complexity: O(m + n)**. The recursion depth depends on the total number of nodes, which results in additional stack space proportional to `m + n`.

## Exercises

### Check your understanding 1

Both the iterative and recursive solutions can relink existing nodes. A reviewer concludes that both therefore use O(1) auxiliary space. Is the conclusion valid? Use two interleaved lists to explain the difference.

**Answer**

It is valid for the iterative pointer-based merge, but not for the recursive version. For lists such as [1, 3, 5] and [2, 4, 6], recursive calls keep alternating between the lists before either suffix can be returned. Those pending calls remain on the stack, so the worst-case auxiliary space is O(m + n). Reusing nodes avoids allocating a new output list; it does not eliminate call frames.

**Checklist**

- Distinguish output-node allocation from call-stack storage.
- Explain why interleaved lists keep many recursive calls pending.
- Give O(1) iterative and O(m + n) recursive auxiliary-space bounds.

### Check your understanding 2

Merge the ascending lists `[-2, 3, 3, 9]` and `[-3, 3, 8]`. Which value sequence should the combined linked list contain?

- [ ] `[-3, -2, 3, 8, 9]`
  > The three nodes whose value is `3` are distinct input nodes, so none may be discarded merely because their values match.
- [ ] `[-2, 3, 3, 9, -3, 3, 8]`
  > Concatenating the inputs leaves `-3` after larger values instead of selecting the smaller current head at each step.
- [x] `[-3, -2, 3, 3, 3, 8, 9]`
  > Comparing the two frontiers preserves ascending order while retaining all three occurrences of `3`.
- [ ] `[-3, -2, 3, 3, 8, 9]`
  > Advancing both inputs after one equal-value choice loses one of the three distinct nodes containing `3`.
