# Delete Nth Node from End of Linked List

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Linked list

> Source: [linked-list-delete-nth-from-end](https://www.greatfrontend.com/questions/algo/linked-list-delete-nth-from-end)

Given the head of a [linked list](https://en.wikipedia.org/wiki/Linked_list), delete the `n-th` node from the end of the list and return the updated head.

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
- `n: number`: An integer indicating the position (from the end) of the node to delete

| Input                         | Output        | Explanation                                                                                           |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `list = [1,2,3,4,5,6], n = 3` | `[1,2,3,5,6]` | The 3rd node from the end is 4. Deleting it results in the list [1, 2, 3, 5, 6].                      |
| `list = [8], n = 1`           | `[]`          | The list contains only one node, which is the 1st from the end. Deleting it results in an empty list. |
| `list = [9,7], n = 1`         | `[9]`         | The 1st node from the end is 7. Deleting it results in the list [9].                                  |

### Constraints

- 1 <= Number of nodes <= 1,000
- 1 <= `n` <= Number of nodes
- 1 <= `ListNode.val` <= 1,000

## Hints

### How can distance from the end become a gap?

Separate two pointers by `n` nodes, then move them together. When the leading pointer reaches the end, where is the trailing pointer relative to the node to remove?

### Who is the predecessor when the head is removed?

A temporary node before the head gives every possible target a predecessor, including the original head.

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function deleteNthNodeFromEnd(
  head: ListNode | null,
  n: number,
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
export default function deleteNthNodeFromEnd(head, n) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Two-Pass

The two-pass approach for deleting the `n`th node from the end of a linked list breaks the problem into two clear steps. The first pass determines the total length of the linked list, and the second pass identifies and removes the target node. The use of a dummy node simplifies edge cases, such as when the head of the list needs to be removed.

By traversing the list in the first pass, the total length of the linked list is calculated. This step ensures the position of the `n`th node from the end can be computed as `(length - n)` from the beginning of the list.

Using the calculated position, the second pass stops at the node just before the target node. This is crucial because removing a node in a linked list requires access to the previous node.

A dummy node is added at the beginning of the list to handle cases where the head node is removed. This ensures the logic remains consistent regardless of the node's position in the list.

Once the node just before the target is located, the target node is bypassed by updating the `next` pointer of its predecessor. This operation ensures the list remains intact and properly linked after the removal.

#### Algorithm

1. Create a `dummy` node with its `next` pointer set to the head of the list.
2. Initialize a variable `length` to 0 and set `first` to the head of the list.
3. Traverse the list to compute the total length:
4. Increment `length` for each node encountered.
5. Move `first` to the next node until the end of the list is reached.
6. Subtract `n` from `length` to calculate the position of the node just before the target node.
7. Reset `first` to the `dummy` node.
8. Traverse the list again until the position of the node just before the target node is reached:
9. Decrement `length` at each step.
10. Move `first` to the next node.
11. Update the `next` pointer of `first` to bypass the target node by pointing to `first.next.next`.
12. Return `dummy.next` as the head of the modified list.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function deleteNthNodeFromEnd(
  head: ListNode | null,
  n: number,
): ListNode | null {
  // Create a dummy node that points to the head of the list
  let dummy: ListNode = { val: 0, next: head };

  // Initialize a variable to keep track of the length of the list
  let length: number = 0;
  let first: ListNode | null = head;

  // Traverse the list to calculate its length
  while (first !== null) {
    length++;
    first = first.next;
  }

  // Calculate the position of the node just before the node to be removed
  length -= n;
  first = dummy;

  // Traverse to the node just before the node to be removed
  while (length > 0) {
    length--;
    first = first.next!;
  }

  // Remove the nth node from the end
  first.next = first.next!.next;

  // Return the modified list, starting from the node after the dummy
  return dummy.next;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The list is traversed twice, once to compute its length and once to locate the target node's predecessor.
- **Space complexity: O(1)**. The algorithm uses a constant amount of additional space.

### 2. Using One-Pass

The one-pass approach for removing the `n`th node from the end of a linked list optimizes traversal by using two pointers. Instead of calculating the total length of the list, this method ensures that both pointers traverse the list in a single iteration, maintaining a fixed gap between them.

The algorithm uses two pointers, `first` and `second`, both starting at the `dummy` node. By advancing the `first` pointer by `n + 1` steps, a gap of `n` nodes is created between `first` and `second`.

Once the gap is established, both pointers are moved simultaneously until `first` reaches the end of the list. At this point, the `second` pointer is positioned just before the node to be removed.

Using the `second` pointer, the target node is skipped by updating `second.next` to `second.next.next`. This ensures that the list remains intact and properly linked after the removal.

A `dummy` node is added at the start of the list to handle cases where the head node is removed. This eliminates the need for special handling of edge cases and simplifies the logic.

#### Algorithm

1. Create a `dummy` node with its `next` pointer set to the head of the list.
2. Initialize two pointers, `first` and `second`, both pointing to the `dummy` node.
3. Advance the `first` pointer by `n + 1` steps to create a gap of `n` nodes between `first` and `second`:
4. If `first` is not `null`, move it to the next node for each step.
5. Move both `first` and `second` pointers one step at a time until `first` reaches the end of the list:
6. Move `first` to `first.next`.
7. Move `second` to `second.next`.
8. Remove the `n`th node from the end by updating `second.next` to `second.next.next`.
9. Return `dummy.next`, which points to the head of the modified list.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function removeNthFromEnd(
  head: ListNode | null,
  n: number,
): ListNode | null {
  // Create a dummy node that points to the head of the list
  const dummy: ListNode = { val: 0, next: head };

  // Initialize two pointers, both starting at the dummy node
  let first: ListNode | null = dummy;
  let second: ListNode | null = dummy;

  // Advance the first pointer so that there is a gap of n nodes between the first and second pointers
  for (let i = 0; i <= n; i++) {
    if (first !== null) {
      first = first.next;
    }
  }

  // Move both pointers until the first pointer reaches the end of the list
  // This maintains the gap between the two pointers
  while (first !== null) {
    first = first.next;
    second = second!.next;
  }

  // Remove the nth node from the end by skipping the node after the second pointer
  if (second !== null && second.next !== null) {
    second.next = second.next.next;
  }

  // Return the head of the modified list, which is the node after the dummy node
  return dummy.next;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The list is traversed once.
- **Space complexity: O(1)**. The algorithm uses a constant amount of additional space.

## Exercises

### Check your understanding 1

A repair keeps the initial gap of `n` links from the dummy but stops when `first.next === null` instead of when `first === null`. Does this repair work for every valid `n`, including deleting the head? Explain the pointer positions.

**Answer**

Yes. First now stops at the last node rather than one position past it. Second remains n links behind, which places it immediately before the nth node from the end. If n equals the list length, the initial advance puts first at the tail and second stays at the dummy; bypassing dummy.next removes the head. The gap and the stopping condition must be reasoned about together.

**Checklist**

- Relate the n-link gap to first stopping at the tail.
- Check n equal to the list length with second at the dummy.
- Explain why mixing this gap with the original null stopping condition fails.

### Check your understanding 2

Both pointers start at a dummy node. A buggy version advances `first` only `n` links, then moves both pointers until `first === null`, and bypasses `second.next` if present. For `[4, 8, 15]` with `n = 1`, what happens?

- [ ] It correctly removes `15`.
  > With this stopping condition, second must stop at 8; the shorter initial gap takes it one node too far.
- [ ] It removes `8`.
  > That would require second to stop at 4. The buggy second pointer instead reaches the tail.
- [ ] It removes `4`.
  > The dummy is not where second stops after the simultaneous traversal.
- [x] It leaves the list unchanged.
  > First starts at 4, and three simultaneous steps leave second at 15. second.next is null, so there is nothing to bypass.
