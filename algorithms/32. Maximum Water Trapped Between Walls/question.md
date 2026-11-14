# Maximum Water Trapped Between Walls

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Arrays

> Source: [maximum-water-between-walls](https://www.greatfrontend.com/questions/algo/maximum-water-between-walls)

Given an array `walls` of wall heights, calculate the maximum volume of water that will be trapped between **two walls** and the x-axis after a heavy downpour.

### Input

- `walls: number[]`: An array of integers

| Input               | Output | Explanation                                                                                                                                                                                                                             |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `walls = [1,4,2,3]` | `6`    | Consider two walls (i=1 & i=3) with heights 4 and 3. The water is limited by the shorter wall with height 3, so the container holds 2 (distance) * 3 (shorter height) = 6 units. All other combination of walls result in smaller area. |
| `walls = [1,1]`     | `1`    | Consider two walls (i=0 & i=1) with heights 1 and 1. The water is limited by the shorter wall (both same in this case i.e. 1), so the container holds 1 (distance) * 1 (shorter height) = 1 unit                                        |
| `walls = [1,0]`     | `0`    | Consider two walls (i=0 & i=1) with heights 1 and 0. The water is limited by the shorter wall with height 0, so the container holds 1 (distance) * 0 (shorter height) = 0 unit                                                          |

### Constraints

- 2 <= `walls.length` <= 1,000
- 0 <= `walls[i]` <= 10,000

## Hints

### What determines the water held by two walls?

Their distance gives the width, while the shorter wall limits the height.

### Which wall can be discarded safely?

Start with the widest pair. Moving either side inward reduces width, but keeping the shorter wall cannot increase the limiting height; what does that imply about which side should move?

## Starter code

**TypeScript**

```ts
export default function maximumWaterBetweenWalls(walls: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} walls
 * @return {number}
 */
export default function maximumWaterBetweenWalls(walls) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force Approach

A brute force approach is to find the maximum water that can be trapped between two walls. The idea is to evaluate every possible pair of walls in the input array and calculate the amount of water that can be held between them. The water held is determined by the shorter wall in the pair and the distance between the two walls.

The brute force approach ensures all pairs of walls are considered, making. The algorithm iterates through each possible pair of walls using nested loops and calculates the area for each pair. The largest area found during this process is returned as the result.

#### Algorithm

1. Initialize a variable `maxArea` to `0` to keep track of the maximum water area found.
2. Use a nested loop to iterate over all pairs of walls:
3. The outer loop represents the left wall, iterating from the first wall to the second-last wall.
4. The inner loop represents the right wall, iterating from one wall after the left wall to the last wall.
5. For each pair of walls, calculate the width between the walls as `right - left`.
6. Determine the height of the container using the shorter wall by calling `Math.min(walls[left], walls[right])`.
7. Calculate the area of water that can be held by multiplying the height and width.
8. Update `maxArea` with the larger value between the current `maxArea` and the newly calculated area.
9. After completing the nested loops, return `maxArea` as the result.

```ts
export default function maximumWaterBetweenWalls(walls: number[]): number {
  // Initialize the maximum area to 0
  let maxArea = 0;

  // Iterate over each pair of walls
  for (let left = 0; left < walls.length; left++) {
    for (let right = left + 1; right < walls.length; right++) {
      // Calculate the width between the walls
      const width = right - left;

      // Calculate the area using the shorter wall
      const currentArea = Math.min(walls[left], walls[right]) * width;

      // Update maxArea if the current area is larger
      maxArea = Math.max(maxArea, currentArea);
    }
  }

  // Return the maximum area found
  return maxArea;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The nested loops iterate over all pairs of walls, leading to a quadratic time complexity.
- **Space complexity: O(1)**. No additional space is used beyond a few variables for tracking the maximum area and calculating values.

### 2. Using Two Pointers

This solution uses the two-pointer technique to optimize the process of finding the maximum water that can be trapped between two walls. The idea is to use two pointers, one starting at the leftmost wall and the other at the rightmost wall, and calculate the area between them. The area is determined by the shorter wall, as it limits the height, and the width between the two walls.

Instead of evaluating every possible pair of walls, as in the brute force approach, the two-pointer technique eliminates unnecessary comparisons by moving the pointers. By always moving the pointer of the shorter wall inward, the algorithm ensures that the width decreases while trying to find a taller wall that could potentially increase the area. This approach avoids unnecessary or duplicated work, reducing the time complexity from O(n2) to O(n).

#### Algorithm

1. Initialize two pointers, `left` at the start of the array and `right` at the end of the array.
2. Initialize a variable `maxWaterArea` to store the maximum water area found.
3. Use a `while` loop to iterate as long as `left` is less than `right`:
4. Calculate the area between the walls pointed to by `left` and `right`. The height is the smaller of the two walls, and the width is the distance between the pointers (`right - left`).
5. Update `maxWaterArea` with the larger value between the current `maxWaterArea` and the newly calculated area.
6. Move the pointer with the shorter wall inward: - If `walls[left]` is smaller, increment `left` to find a taller wall. - Otherwise, decrement `right` to find a taller wall on the right.
7. Return `maxWaterArea` as the maximum water area found.

```ts
export default function maximumWaterBetweenWalls(walls: number[]): number {
  // Initialize variables for pointers and maximum area
  let left = 0;
  let right = walls.length - 1;
  let maxWaterArea = 0;

  // Iterate while left and right pointers haven't crossed
  while (left < right) {
    // Calculate the area formed between the walls pointed by 'left' and 'right'.
    // The height is limited by the shorter wall, and the width is (right - left).
    const currentArea = (right - left) * Math.min(walls[left], walls[right]);
    maxWaterArea = Math.max(maxWaterArea, currentArea);

    // Move the pointer with the shorter height towards the center
    // By doing this, we give a chance to find a taller wall and potentially increase the area.
    if (walls[left] < walls[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWaterArea;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each pointer moves at most `n` steps, leading to a linear runtime.
- **Space complexity: O(1)**. No additional space is required beyond a few variables for tracking pointers and area calculations.

## Exercises

### Check your understanding 1

Someone sorts the wall heights before applying two pointers, reasoning that only the two chosen heights matter. Which statement explains the error?

- [ ] Sorting changes the numeric heights.
  > Sorting preserves the heights themselves; the information it loses is their original position.
- [x] Sorting changes distances between heights, which can change the best area.
  > For [5, 1, 5], the two tall walls hold area 10. Sorting to [1, 5, 5] places them adjacent, and the best area becomes 5.
- [ ] Negative heights make the comparator invalid.
  > Heights are nonnegative under the contract, and a numeric comparator can sort them.
- [ ] The answer stays correct; only the runtime becomes worse.
  > The changed positions can change the answer, independently of the sorting cost.

### Check your understanding 2

At positions `left < right`, suppose the left wall is no taller than the right wall. Prove that discarding the left wall cannot lose a better unexamined pair within the current interval. Include the case where the endpoint heights are equal.

**Answer**

For any j between left and right, the pair (left, j) has width at most right - left and limiting height at most walls[left]. Its area therefore cannot exceed the already evaluated pair (left, right). No better remaining pair needs left, so it can be discarded. If the heights are equal, the same argument also applies to right; either endpoint can be moved inward without losing a better result.

**Checklist**

- Bound both the width and limiting height of every pair retaining left.
- Compare those bounds to the area already evaluated.
- Justify either choice when endpoint heights tie.
