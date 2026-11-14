import { describe, test, expect } from "vitest";

import drizzle, {
  and,
  asc,
  desc,
  eq,
  integer,
  or,
  table,
  text,
} from "./drizzle-query-builder";

const users = table("users", {
  id: integer("id"),
  name: text("name"),
  age: integer("age"),
  role: text("role"),
});

describe("Drizzle Query Builder", () => {
  test("select().from(table).all() returns all rows", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada", age: 31, role: "admin" },
        { id: 2, name: "Grace", age: 28, role: "editor" },
      ],
    });

    expect(db.select().from(users).all()).toEqual([
      { id: 1, name: "Ada", age: 31, role: "admin" },
      { id: 2, name: "Grace", age: 28, role: "editor" },
    ]);
  });

  test("where() supports eq(), and(), and or()", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada", age: 31, role: "admin" },
        { id: 2, name: "Grace", age: 28, role: "editor" },
        { id: 3, name: "Linus", age: 35, role: "admin" },
      ],
    });

    expect(
      db
        .select()
        .from(users)
        .where(
          and(
            eq(users.role, "admin"),
            or(eq(users.age, 31), eq(users.age, 35)),
          ),
        )
        .all(),
    ).toEqual([
      { id: 1, name: "Ada", age: 31, role: "admin" },
      { id: 3, name: "Linus", age: 35, role: "admin" },
    ]);
  });

  test("orderBy(), offset(), and limit() shape the final result", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada", age: 31, role: "admin" },
        { id: 2, name: "Grace", age: 28, role: "editor" },
        { id: 3, name: "Linus", age: 35, role: "admin" },
        { id: 4, name: "Margaret", age: 28, role: "admin" },
      ],
    });

    expect(
      db
        .select()
        .from(users)
        .orderBy(asc(users.age), desc(users.id))
        .offset(1)
        .limit(2)
        .all(),
    ).toEqual([
      { id: 2, name: "Grace", age: 28, role: "editor" },
      { id: 1, name: "Ada", age: 31, role: "admin" },
    ]);
  });
});
