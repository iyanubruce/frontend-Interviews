import { describe, test, expect } from "vitest";

import drizzle, {
  asc,
  eq,
  integer,
  table,
  text,
} from "./drizzle-query-builder-iii";

const users = table("users", {
  id: integer("id"),
  name: text("name"),
});

const posts = table("posts", {
  id: integer("id"),
  authorId: integer("authorId"),
  title: text("title"),
});

describe("Drizzle Query Builder III", () => {
  test("leftJoin() returns nested table results and null for missing rows", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada" },
        { id: 2, name: "Grace" },
      ],
      posts: [{ id: 10, authorId: 1, title: "Intro" }],
    });

    expect(
      db
        .select()
        .from(users)
        .leftJoin(posts, eq(users.id, posts.authorId))
        .orderBy(asc(users.id), asc(posts.id))
        .all(),
    ).toEqual([
      {
        users: { id: 1, name: "Ada" },
        posts: { id: 10, authorId: 1, title: "Intro" },
      },
      {
        users: { id: 2, name: "Grace" },
        posts: null,
      },
    ]);
  });

  test("innerJoin() keeps only matching rows", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada" },
        { id: 2, name: "Grace" },
      ],
      posts: [{ id: 10, authorId: 1, title: "Intro" }],
    });

    expect(
      db
        .select()
        .from(users)
        .innerJoin(posts, eq(users.id, posts.authorId))
        .all(),
    ).toEqual([
      {
        users: { id: 1, name: "Ada" },
        posts: { id: 10, authorId: 1, title: "Intro" },
      },
    ]);
  });

  test("select({ ... }) can project fields across joined tables", () => {
    const db = drizzle({
      users: [
        { id: 1, name: "Ada" },
        { id: 2, name: "Grace" },
      ],
      posts: [{ id: 10, authorId: 1, title: "Intro" }],
    });

    expect(
      db
        .select({
          userName: users.name,
          postTitle: posts.title,
        })
        .from(users)
        .leftJoin(posts, eq(users.id, posts.authorId))
        .orderBy(asc(users.id))
        .all(),
    ).toEqual([
      { userName: "Ada", postTitle: "Intro" },
      { userName: "Grace", postTitle: null },
    ]);
  });
});
