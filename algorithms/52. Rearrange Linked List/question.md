# Rearrange Linked List

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Linked list

> Source: [linked-list-rearrange](https://www.greatfrontend.com/questions/algo/linked-list-rearrange)

Given the head of a [linked list](https://en.wikipedia.org/wiki/Linked_list), `head`, reorder the list to alternate between nodes from the start and the end of the list. The reordering should be performed by rearranging the nodes themselves, without modifying the values stored in the nodes.

The original structure is as follows:

`L0 → L1 → ... → Ln-1 → Ln`

Reorganize the list into this structure:

`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`

The linked list is represented by a sequence of `ListNode`s, where each node points to the next node in the sequence, or `null` if it is the last node.

A `ListNode` has the following interface:

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}
```

### Input

- `head: ListNode`: Head of the linked list. Examples display each linked list as an array of values within the list

| Input                            | Output                    | Explanation                                                               |
| -------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `list = [9,9,10,7,10,6,4,2,3,1]` | `[9,1,9,3,10,2,7,4,10,6]` | The list is reordered to alternate between the start and end of the list. |
| `list = [1,2,3,4,5,6]`           | `[1,6,2,5,3,4]`           | The list is reordered to alternate between the start and end of the list. |

### Constraints

- 1 <= Number of nodes <= 1,000
- 1 <= `ListNode.val` <= 1,000

## Hints

### What makes taking nodes from the end difficult?

A singly linked list only moves forward. Split the list around its midpoint and consider how the back half could expose its nodes in tail-to-middle order.

### Can the back half run in the opposite direction?

Reverse that half. You then have two forward-moving lists whose nodes can be alternated, as long as each original `next` link is saved before rewiring it.

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function rearrangeLinkedList(head: ListNode | null): void {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {ListNode} head
 * @return {void}
 */
export default function rearrangeLinkedList(head) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Merge List with Reversed Sublist

The problem involves rearranging a linked list such that nodes alternate between the first and second halves of the list. This approach uses a combination of three key steps: locating the middle of the list, reversing the second half of the list, and merging the two halves.

The middle of the linked list is determined using the two-pointer technique. The `slow` pointer moves one step at a time, while the `fast` pointer moves two steps. When the `fast` pointer reaches the end, the `slow` pointer is at the middle. This splits the list into two halves.

The second half of the list is reversed in place. This transforms the linked list into two parts: the first half in the original order and the second half in reversed order. Reversing is done to facilitate the alternating merge.

The two halves are merged by alternately selecting nodes from the first and reversed second halves. This rearranges the list in the desired alternating pattern.

This approach efficiently solves the problem in linear time and uses constant space for reordering nodes.

#### Algorithm

1. Check if the `head` is `null`. If true, return immediately as there is nothing to rearrange.
2. Initialize two pointers, `slow` and `fast`, both set to the `head` of the linked list.
3. Locate the middle of the list:
4. Move `slow` one step and `fast` two steps at a time.
5. Stop when `fast` is `null` or `fast.next` is `null`. The `slow` pointer will now point to the middle node.
6. Reverse the second half of the list:
7. Initialize `prev` to `null` and `curr` to `slow`.
8. Traverse the list from `slow` to the end: - Store the next node in a temporary variable `tmp`. - Update `curr.next` to point to `prev`. - Move `prev` to `curr` and `curr` to `tmp`.
9. Merge the two halves of the list:
10. Initialize `first` to the `head` of the list and `second` to `prev` (head of the reversed second half).
11. Alternately link nodes from `first` and `second`: - Store the next node of `first` in `tmp1` and `second` in `tmp2`. - Update `first.next` to point to `second` and `second.next` to point to `tmp1`. - Move `first` to `tmp1` and `second` to `tmp2`.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function rearrangeLinkedList(head: ListNode | null): void {
  if (head === null) {
    return;
  }

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // Locate the middle node of the linked list
  // For example, in the list 1->2->3->4->5->6, the middle is 4
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  // Reverse the second half of the list
  // Transform 1->2->3->4->5->6 into 1->2->3->4 and 6->5->4 (reversed in-place)
  let prev: ListNode | null = null;
  let curr: ListNode | null = slow;
  while (curr !== null) {
    const tmp: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = tmp;
  }

  // Merge the two halves of the list
  // Combine 1->2->3->4 and 6->5->4 into 1->6->2->5->3->4
  let first: ListNode | null = head;
  let second: ListNode | null = prev;
  while (second !== null && second.next !== null) {
    const tmp1: ListNode | null = first!.next;
    first!.next = second;
    first = tmp1;

    const tmp2: ListNode | null = second.next;
    second.next = first;
    second = tmp2;
  }
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited once during the three steps: finding the middle, reversing the second half, and merging.
- **Space complexity: O(1)**. The algorithm uses a constant amount of additional space.

## Exercises

### Check your understanding 1

Consider the variant that reverses starting at the midpoint without first severing the first half. On `A → B → C → D → E`, the two cursors then see `A → B → C` and `E → D → C`, sharing `C`. Why should weaving stop before consuming the final node of the reversed half again?

**Answer**

After weaving E and D, the list is A → E → B → D → C. Both cursors have reached the same midpoint C, whose next is null. Processing C as though it were two distinct nodes can assign C.next = C and create a cycle. A guard such as `second.next !== null` leaves the shared endpoint in place. A variant that explicitly splits into disjoint lists needs its own stopping rule instead.

**Checklist**

- Identify C as a shared node, not two copies with equal values.
- Show the correct chain after the two useful weaving steps.
- Explain how one extra iteration can create a self-loop.

### Check your understanding 2

For nodes `A(1) → B(2) → C(3) → D(4) → E(5)`, a candidate writes values `1, 5, 2, 4, 3` into the existing chain without changing any links. Which assertion catches the contract violation that an array-of-values check misses?

- [ ] The values read from the head are `[1, 5, 2, 4, 3]`.
  > The candidate deliberately produces these values, so this assertion passes.
- [ ] Exactly five nodes are reachable from the head.
  > Overwriting values preserves the number of nodes.
- [x] `A.next === E`, where `E` is the original tail object.
  > The task requires rearranging nodes. The candidate leaves A.next equal to B and changes B's value instead.
- [ ] The head is still the object `A`.
  > Both the correct rearrangement and this candidate preserve A as the head.
