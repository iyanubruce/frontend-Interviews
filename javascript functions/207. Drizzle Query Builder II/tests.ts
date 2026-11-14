import { describe, test, expect } from "vitest";

import drizzle, {
  asc,
  eq,
  integer,
  table,
  text,
} from "./drizzle-query-builder-ii";

const users = table("users", {
  id: integer("id"),
  name: text("name"),
  email: text("email"),
  role: text("role"),
});

describe("Drizzle Query Builder II", () => {
  test("select() without arguments still returns full rows", () => {
    const db = drizzle({
      users: [{ id: 1, name: "Ada", email: "ada@example.com", role: "admin" }],
    });

    expect(db.select().from(users).all()).toEqual([
      { id: 1, name: "Ada", email: "ada@example.com", role: "admin" },
    ]);
  });

  test("select({ ... }) returns aliased fields only", () => {
    const db = drizzle({
      users: [{ id: 1, name: "Ada", email: "ada@example.com", role: "admin" }],
    });

    expect(
      db
        .select({
          userId: users.id,
          displayName: users.name,
        })
        .from(users)
        .all(),
    ).toEqual([{ userId: 1, displayName: "Ada" }]);
  });

  test("selection still works with where() and orderBy()", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada", email: "ada@example.com", role: "admin" },
        { id: 2, name: "Grace", email: "grace@example.com", role: "editor" },
        { id: 3, name: "Linus", email: "linus@example.com", role: "admin" },
      ],
    });

    expect(
      db
        .select({
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.role, "admin"))
        .orderBy(asc(users.id))
        .all(),
    ).toEqual([
      { email: "ada@example.com", role: "admin" },
      { email: "linus@example.com", role: "admin" },
    ]);
  });
});
