import { describe, test, it, expect } from "vitest";

import MiniORM from "./mini-object-relational-mapper";

describe("MiniORM", () => {
  test("creates model delegates that can read initial records", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });

    expect(db).toBeInstanceOf(MiniORM);
    expect(db.user.findMany()).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  test("findMany() supports exact-match filtering", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "editor" },
        { id: 3, name: "Cara", role: "admin" },
      ],
    });

    expect(db.user.findMany({ where: { role: "admin" } })).toEqual([
      { id: 1, name: "Alice", role: "admin" },
      { id: 3, name: "Cara", role: "admin" },
    ]);
  });

  test("create() appends a new record and returns it", () => {
    const db = new MiniORM({
      user: [{ id: 1, name: "Alice" }],
    });

    expect(
      db.user.create({
        data: { id: 2, name: "Bob" },
      }),
    ).toEqual({ id: 2, name: "Bob" });

    expect(db.user.findMany()).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  test("update() shallow-merges the matching record", () => {
    const db = new MiniORM({
      user: [{ id: 1, name: "Alice", role: "admin" }],
    });

    expect(
      db.user.update({
        where: { id: 1 },
        data: { role: "editor", active: true },
      }),
    ).toEqual({
      id: 1,
      name: "Alice",
      role: "editor",
      active: true,
    });
  });

  test("delete() removes the matching record and returns it", () => {
    const db = new MiniORM({
      user: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });

    expect(
      db.user.delete({
        where: { id: 1 },
      }),
    ).toEqual({ id: 1, name: "Alice" });

    expect(db.user.findMany()).toEqual([{ id: 2, name: "Bob" }]);
  });
});
