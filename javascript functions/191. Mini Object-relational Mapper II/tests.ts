import { describe, test, expect } from "vitest";

import MiniORM from "./mini-object-relational-mapper-ii";

describe("MiniORM", () => {
  test("keeps the original CRUD API from Mini ORM", () => {
    const db = new MiniORM({
      user: [{ id: 1, name: "Alice", role: "admin" }],
    });

    db.user.create({
      data: { id: 2, name: "Bob", role: "editor" },
    });
    db.user.update({
      where: { id: 2 },
      data: { role: "owner" },
    });

    expect(db.user.findMany()).toEqual([
      { id: 1, name: "Alice", role: "admin" },
      { id: 2, name: "Bob", role: "owner" },
    ]);
  });

  test("findMany() supports comparison operators", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice", age: 17 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Cara", age: 31 },
      ],
    });

    expect(
      db.user.findMany({
        where: { age: { gte: 18, lt: 30 } },
      }),
    ).toEqual([{ id: 2, name: "Bob", age: 24 }]);
  });

  test("findMany() supports in and contains filters", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "editor" },
        { id: 3, name: "Cara", role: "viewer" },
      ],
    });

    expect(
      db.user.findMany({
        where: {
          role: { in: ["admin", "viewer"] },
          name: { contains: "a" },
        },
      }),
    ).toEqual([{ id: 3, name: "Cara", role: "viewer" }]);
  });

  test("findMany() supports orderBy", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice", age: 24 },
        { id: 2, name: "Bob", age: 31 },
        { id: 3, name: "Cara", age: 19 },
      ],
    });

    expect(
      db.user.findMany({
        orderBy: { age: "desc" },
      }),
    ).toEqual([
      { id: 2, name: "Bob", age: 31 },
      { id: 1, name: "Alice", age: 24 },
      { id: 3, name: "Cara", age: 19 },
    ]);
  });
});
