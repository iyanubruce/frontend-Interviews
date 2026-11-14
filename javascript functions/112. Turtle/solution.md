# Turtle — Solution

Model the turtle as a tiny state machine. The common miss is to treat movement as independent `x`/`y` math and forget that the current direction decides which coordinate changes.

The turtle has one condition after every operation: `(x, y, direction)` fully describes the next move. Turns only change `direction`; moves only change one coordinate based on `direction`. Because turns are always 90 degrees, direction can be stored as one of four numeric states rather than a free-form angle.

| Direction state | Facing | `forward(d)` effect | `backward(d)` effect |
| --- | --- | --- | --- |
| `0` | North | `y += d` | `y -= d` |
| `1` | East | `x += d` | `x -= d` |
| `2` | South | `y -= d` | `y += d` |
| `3` | West | `x -= d` | `x += d` |

Implement the class as follows:

1. Initialize `x`, `y`, and `direction` once in the constructor so every instance has independent state.
2. Represent direction as `0..3`, because a 90-degree turn is just adding or subtracting one state.
3. Route all distance changes through one movement helper so forward and backward cannot drift apart.
4. Return `this` from each mutating method so every state transition can participate in a chain.

The integer direction model is easier to justify than storing strings like `"north"` or angles in degrees: it keeps wraparound local to the turn methods and makes each movement branch a direct consequence of the four-state table.

### Turning

Using integers `0` through `3` makes `left()` and `right()` simple modulo arithmetic. Turning left subtracts `1`, turning right adds `1`, and `% 4` wraps the value back into the valid range.

### Moving

`forward(distance)` and `backward(distance)` share the same movement logic. A private `_move(distance)` helper updates either `x` or `y` based on the current direction, and `backward(distance)` can reuse that by passing a negative distance.

### Method chaining

Every mutating method returns `this`, which enables fluent calls like `turtle.right().forward(5).left()`.

For example, `new Turtle().right().forward(3).left().backward(2)` moves through these states:

| Call | Position | Direction |
| --- | --- | --- |
| start | `[0, 0]` | North |
| `right()` | `[0, 0]` | East |
| `forward(3)` | `[3, 0]` | East |
| `left()` | `[3, 0]` | North |
| `backward(2)` | `[3, -2]` | North |

```ts
enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

const NUMBER_OF_CARDINAL_DIRECTIONS = 4;

export default class Turtle {
  x: number;
  y: number;
  direction: Direction;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = Direction.North;
  }

  forward(distance: number): Turtle {
    this._move(distance);
    return this;
  }

  backward(distance: number): Turtle {
    this._move(-distance);
    return this;
  }

  _move(distance: number): Turtle {
    switch (this.direction) {
      case Direction.North:
        this.y += distance;
        break;
      case Direction.East:
        this.x += distance;
        break;
      case Direction.South:
        this.y -= distance;
        break;
      case Direction.West:
        this.x -= distance;
        break;
    }
    return this;
  }

  left(): Turtle {
    // Wrap around behavior.
    this.direction =
      (this.direction - 1 + NUMBER_OF_CARDINAL_DIRECTIONS) %
      NUMBER_OF_CARDINAL_DIRECTIONS;
    return this;
  }

  right(): Turtle {
    // Wrap around behavior.
    this.direction =
      (this.direction + 1 + NUMBER_OF_CARDINAL_DIRECTIONS) %
      NUMBER_OF_CARDINAL_DIRECTIONS;
    return this;
  }

  position(): [number, number] {
    return [this.x, this.y];
  }
}
```

## Edge cases

- Repeated turns wrap around the four direction states, so `left()` from north becomes west and `right()` from west becomes north.
- Negative distances work naturally because movement is just addition or subtraction on the current axis.
- `position()` only reads the current coordinates; it does not expose a mutable internal object.
- Returning `this` from `forward()`, `backward()`, `left()`, and `right()` is what makes chaining possible.
- The class intentionally models only cardinal directions and 90-degree turns, matching the prompt rather than the full Python turtle API.
