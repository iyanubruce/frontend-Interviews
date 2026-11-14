# Linked List Reversal

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** Linked list

> Source: [linked-list-reversal](https://www.greatfrontend.com/questions/algo/linked-list-reversal)

Given the head of a [linked list](https://en.wikipedia.org/wiki/Linked_list), reverse the list and return the new head of the reversed list.

The linked list is represented by a sequence of `ListNode`s, where each node points to the next node in the sequence, or `null` if it is the last node.

A `ListNode` has the following interface:

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}
```

### Input

- `head: ListNode | null`: Head of the linked list, or `null` if the list is empty. Examples display each linked list as an array of values within the list

For an empty list, return `null`.

| Input                | Output        | Explanation                                                                                         |
| -------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `list = [1,2,3,4,5]` | `[5,4,3,2,1]` | The input list [1, 2, 3, 4, 5] creates a linked list that, when reversed, produces [5, 4, 3, 2, 1]. |
| `list = []`          | `[]`          | The input list is empty, so the reversed linked list is also empty.                                 |

### Constraints

- 0 <= Number of nodes <= 1,000
- -1,000 <= `ListNode.val` <= 1,000

## Hints

### Which link disappears when a node is reversed?

Before pointing the current node back toward the reversed prefix, save its old `next` reference. That is the only route to the untouched part of the list.

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function reverseLinkedList(
  head: ListNode | null,
): ListNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {Node | null}
 */
export default function reverseLinkedList(head) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Iterative Method

Reversing a linked list involves flipping the `next` pointers of all nodes so that they point to the previous node instead of the next node. The iterative approach uses two pointers, `prev` and `curr`, to track the previous and current nodes, respectively. This ensures that the list is reversed in-place without requiring additional memory.

The `curr` pointer traverses the list from the head to the end, while the `prev` pointer lags behind, building the reversed portion of the list step by step.

By using only a few pointers (`prev`, `curr`, and a temporary pointer for the next node), the algorithm achieves the reversal without requiring additional space for a new list.

The process ends when the `curr` pointer becomes `null`, indicating that all nodes have been reversed. At this point, the `prev` pointer points to the new head of the reversed list.

#### Algorithm

1. Initialize two pointers:

- `prev` to `null`, representing the previous node.
- `curr` to the `head`, representing the current node.

2. Iterate over the list while `curr` is not `null`:
1. Store the next node in a temporary variable `nextTemp` (`curr.next`).
1. Reverse the `next` pointer of the current node (`curr.next = prev`).
1. Move the `prev` pointer to the current node (`prev = curr`).
1. Move the `curr` pointer to the next node (`curr = nextTemp`).
1. After the loop, the `prev` pointer will point to the new head of the reversed list.
1. Return `prev` as the new head.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function reverseLinkedList(
  head: ListNode | null,
): ListNode | null {
  // Initialize pointers
  let prev: ListNode | null = null; // Previous node, initially null
  let curr: ListNode | null = head; // Current node, starts with head

  // Iterate over the linked list
  while (curr !== null) {
    // Temporarily store the next node
    const nextTemp: ListNode | null = curr.next;

    // Reverse the current node's pointer
    curr.next = prev;

    // Move prev and curr one step forward
    prev = curr;
    curr = nextTemp;
  }

  // Return the new head of the reversed list
  return prev;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in the list is visited once.
- **Space complexity: O(1)**. The algorithm uses a constant amount of additional space.

### 2. Using Recursive Method

Reversing a linked list recursively involves breaking the problem into smaller subproblems by reversing the tail portion of the list first and adjusting the pointers as the recursion is called. The key is to reverse the `next` pointers of the nodes one step at a time as the recursion propagates back up the call stack.

The problem is divided into reversing the sublist starting from the second node onward (`head.next`). The base case occurs when the list is empty or has only one node, in which case the reversal is complete.

During each recursive call, the `next` pointer of the subsequent node is updated to point back to the current node (`head`). This reverses the direction of the `next` pointer for each node.

The recursive call returns the new head of the reversed sublist, which propagates back to the top-level caller. This ensures that the final head of the reversed list is returned.

The algorithm operates directly on the nodes of the list without requiring additional space for a new list or auxiliary data structures.

#### Algorithm

1. Check the base case:

- If `head` is `null` or `head.next` is `null`, return `head` as the reversed list.

2. Recursively call `reverseLinkedList` with `head.next` to reverse the remainder of the list.

- Store the result in a variable `p`, which represents the new head of the reversed list.

3. Adjust the pointers:

- Set `head.next.next` to `head`, reversing the `next` pointer for the current node.
- Set `head.next` to `null` to disconnect the current node from the original list structure.

4. Return `p` as the new head of the reversed list.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function reverseLinkedList(
  head: ListNode | null,
): ListNode | null {
  // Base case: if the list is empty or has only one node, return the head
  if (head === null || head.next === null) {
    return head;
  }

  // Recursive case: reverse the rest of the list
  const p: ListNode | null = reverseLinkedList(head.next);

  // Set the next node's next reference to the current node
  head.next.next = head;

  // Set the current node's next reference to null
  head.next = null;

  // Return the new head of the reversed list
  return p;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited exactly once during the recursion.
- **Space complexity: O(n)**. The recursion depth is proportional to the size of the list, requiring additional stack space.

## Exercises

### Check your understanding 1

The recursive reversal performs `head.next.next = head` while unwinding, but omits `head.next = null`. Which smallest input exposes the resulting structural bug?

- [ ] An empty list.
  > The base case returns before any rewiring.
- [ ] One node with next equal to null.
  > This also returns from the base case.
- [x] Two nodes, `A → B → null`.
  > The recursive return adds B.next = A, but A.next still points to B. The result contains a two-node cycle.
- [ ] At least three nodes are required.
  > A single unwinding step already creates the cycle on two nodes.

### Check your understanding 2

The list begins as `A → B → C → null`. An iterative reversal starts with `previous = null` and `current = A`. What state should hold after exactly one complete loop iteration?

- [ ] `previous = B`, `current = C`, and `B.next = A`
  > This is the state after processing both `A` and `B`, not after only the first iteration.
- [ ] `previous = A`, `current = B`, and `A.next = B`
  > The first iteration must redirect `A.next` to the earlier prefix, which is initially `null`.
- [ ] `previous = A`, `current = null`, and `A.next = null`
  > Saving the original `A.next` before rewiring preserves `B` as the next current node rather than losing the suffix.
- [x] `previous = A`, `current = B`, and `A.next = null`
  > The original link to `B` is saved for `current`, while `A` becomes the complete one-node reversed prefix ending at `null`.
