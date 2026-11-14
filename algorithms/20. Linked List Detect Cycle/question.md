# Linked List Detect Cycle

**Difficulty:** Easy · **Duration:** ~30 min · **Topics:** Linked list

> Source: [linked-list-detect-cycle](https://www.greatfrontend.com/questions/algo/linked-list-detect-cycle)

Given the head node of a [linked list](https://en.wikipedia.org/wiki/Linked_list), determine whether the list contains a cycle. Return `true` if the list contains a cycle; otherwise, return `false`.

A linked list has a cycle if there exists a node that can be revisited by continuously following the next pointers.

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

| Input                        | Output  | Explanation                                                                                                                                                                                                                                                                                                                |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list = [1,2,3], pos = 0`    | `true`  | The linked list is constructed from the array [1, 2, 3] with the pos = 0, which means the last node (value 3) connects back to the 0th node (value 1). The structure of the linked list is: 1 -> 2 -> 3 -> (back to 1). This forms a cycle starting from node 1. Hence, the output is true.                                |
| `list = [1], pos = -1`       | `false` | The linked list has only one node with the value 1. The pos = -1 indicates that the last node does not connect to any other node. The structure of the linked list is: 1 -> null. Since the list terminates with null and does not loop back to any earlier node, it does not contain a cycle. Hence, the output is false. |
| `list = [3,2,0,-4], pos = 1` | `true`  | The linked list is constructed from the array [3, 2, 0, -4] with the pos = 1, which means the last node (value -4) connects back to the 1st node (value 2). The structure of the linked list is: 3 -> 2 -> 0 -> -4 -> (back to 2). This forms a cycle starting at node 2. Hence, the output is true.                       |

### Constraints

- 0 <= Number of nodes <= 1,000
- -1,000 <= `ListNode.val` <= 1,000

## Hints

### What exactly has to repeat?

A cycle revisits the same node object, not merely the same value. How could the traversal recognize an identity it has already encountered?

## Starter code

**TypeScript**

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListDetectCycle(head: ListNode | null): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {ListNode} head
 * @return {boolean}
 */
export default function linkedListDetectCycle(head) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Set

The approach for detecting a cycle in a linked list using a `Set` uses the property that a cycle causes repeated traversal of certain nodes. By storing visited nodes in a `Set`, the algorithm efficiently checks if a node has already been seen. If a node is revisited, a cycle exists. Otherwise, if the traversal reaches the end of the list, no cycle is present.

The `Set` provides an efficient way to store and check for the existence of nodes. The time complexity of insertion and lookup in a `Set` is O(1), making it well-suited for this task.

During traversal, each node is added to the `Set`. If a node is encountered that is already present in the `Set`, it means the list has cycled back to a previously visited node.

Stop when a repeated node is found, because it confirms a cycle.

If the end of the list (`null`) is reached without encountering a repeated node, it confirms there is no cycle in the list.

This approach is simple and uses additional space to track visited nodes.

#### Algorithm

1. Create a `Set` named `nodesSeen` to store nodes that have been visited.
2. Initialize a variable `current` to point to the head of the linked list.
3. Traverse the list using a `while` loop until `current` becomes `null`:
4. Check if `current` is already in `nodesSeen`. - If `true`, return `true` as a cycle is detected.
5. Add `current` to `nodesSeen`.
6. Move `current` to the next node in the list.
7. If the loop ends without detecting a cycle, return `false`.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListDetectCycle(head: ListNode | null): boolean {
  // Create a Set to track nodes that have been visited
  const nodesSeen = new Set<ListNode>();
  // Start with the head of the linked list
  let current = head;

  // Traverse the linked list
  while (current !== null) {
    // If the current node has been seen before, a cycle is present
    if (nodesSeen.has(current)) {
      return true;
    }

    // Add the current node to the Set of seen nodes
    nodesSeen.add(current);

    // Move to the next node in the linked list
    current = current.next;
  }

  // If the end of the list is reached without finding a cycle, return false
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in the list is visited once.
- **Space complexity: O(n)**. The `Set` stores up to `n` nodes in the worst case (when there is no cycle).

### 2. Using Floyd Cycle Algorithm

The Floyd Cycle Detection Algorithm, also known as the "Tortoise and Hare" algorithm, is an efficient method for detecting a cycle in a linked list. The algorithm uses two pointers, a `slow` pointer and a `fast` pointer, which traverse the list at different speeds. If a cycle exists, the two pointers will eventually meet. Otherwise, the `fast` pointer will reach the end of the list.

The `slow` pointer moves one step at a time, while the `fast` pointer moves two steps at a time. This difference in speed ensures that if there is a cycle, the `fast` pointer will eventually catch up to the `slow` pointer.

If the two pointers meet during traversal, it confirms the presence of a cycle. This is because the `fast` pointer loops around the cycle and catches up to the `slow` pointer.

If the `fast` pointer reaches the end of the list (`null`), it means there is no cycle in the list.

The algorithm operates in linear time and uses constant space, making it optimal for detecting cycles in linked lists.

#### Algorithm

1. Check if the head of the list is `null`. If true, return `false` as an empty list cannot have a cycle.
2. Initialize two pointers:

- `slow` pointer set to the head of the list.
- `fast` pointer set to `head.next`.

3. Traverse the list using a `while` loop:
1. Check if `fast` or `fast.next` is `null`. If true, return `false` as there is no cycle.
1. Move the `slow` pointer one step forward (`slow = slow.next`).
1. Move the `fast` pointer two steps forward (`fast = fast.next.next`).
1. Check if the `slow` pointer is equal to the `fast` pointer. If true, return `true` as a cycle is detected.
1. If the loop ends without the pointers meeting, return `false` as no cycle exists.

```ts
interface ListNode {
  val: number;
  next: ListNode | null;
}

export default function linkedListDetectCycle(head: ListNode | null): boolean {
  // If the list is empty or has only one node without a cycle, return false
  if (head === null) {
    return false;
  }

  // Initialize two pointers: slow and fast
  // Slow pointer advances by one step at a time
  let slow: ListNode | null = head;
  // Fast pointer advances by two steps at a time
  let fast: ListNode | null = head.next;

  // Traverse the list
  while (fast !== null && fast.next !== null) {
    // Move slow pointer by one step
    if (slow === null) {
      // This check is for TypeScript to satisfy non-null assertions
      return false;
    }
    slow = slow.next;

    // Move fast pointer by two steps
    fast = fast.next.next;

    // If slow and fast pointers meet, a cycle is detected
    if (slow === fast) {
      return true;
    }
  }

  // If fast pointer reaches the end of the list, no cycle exists
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each pointer traverses the list at most once.
- **Space complexity: O(1)**. The algorithm uses only two pointers, regardless of the size of the list.

## Exercises

### Check your understanding 1

Once Floyd's slow and fast pointers are inside a cycle of length `c`, why must speeds of one and two links eventually produce a meeting? Would moving both pointers one link per iteration provide the same guarantee if they start at different nodes?

**Answer**

Measure their relative position modulo c. With speeds one and two, the relative position changes by one on each iteration, so within at most c iterations it reaches zero. With equal speeds, their offset stays fixed; two distinct positions in the cycle can remain distinct forever. This is why following the same links is not sufficient: the difference in speeds supplies the guarantee.

**Checklist**

- Use relative position modulo the cycle length.
- Explain why a one-position change must reach zero.
- Show that equal speeds preserve a nonzero offset.

### Check your understanding 2

Four distinct nodes are linked as `A(5) → B(7) → C(5) → D(9)`, and `D.next` points to node `B`. Which conclusion is correct?

- [ ] The list is acyclic because it contains only four distinct node objects.
  > Following `D.next` revisits `B`, after which traversal repeats `B → C → D` indefinitely.
- [x] The list contains a cycle because traversal from `D` returns to the same node object `B`.
  > The link closes the identity path `B → C → D → B`, so following `next` pointers never reaches `null`.
- [ ] The list contains a cycle whose entry is `C` because both `A` and `C` store the value `5`.
  > Equal values do not connect nodes; the actual repeated object is `B`, reached through `D.next`.
- [ ] The list is acyclic because a single backward link is followed only once.
  > A `next` reference has no one-use limit, so returning to `B` causes the same links to be followed repeatedly.
