import { describe, test, expect } from "vitest";

import MiniORM, { type RelationMap } from "./mini-object-relational-mapper-iii";

const relations: RelationMap = {
  user: {
    posts: {
      model: "post",
      type: "many",
      sourceKey: "id",
      targetKey: "authorId",
    },
  },
  post: {
    author: {
      model: "user",
      type: "one",
      sourceKey: "authorId",
      targetKey: "id",
    },
  },
};

describe("MiniORM", () => {
  test("findMany() supports select", () => {
    const db = new MiniORM({
      user: [{ id: 1, name: "Alice", age: 30 }],
    });

    expect(
      db.user.findMany({
        select: { id: true, name: true },
      }),
    ).toEqual([{ id: 1, name: "Alice" }]);
  });

  test("findMany() supports including one-to-many relations", () => {
    const db = new MiniORM(
      {
        user: [{ id: 1, name: "Alice" }],
        post: [
          { id: 10, title: "Hello", authorId: 1 },
          { id: 11, title: "World", authorId: 1 },
        ],
      },
      relations,
    );

    expect(
      db.user.findMany({
        include: { posts: true },
      }),
    ).toEqual([
      {
        id: 1,
        name: "Alice",
        posts: [
          { id: 10, title: "Hello", authorId: 1 },
          { id: 11, title: "World", authorId: 1 },
        ],
      },
    ]);
  });

  test("findMany() supports including one-to-one relations", () => {
    const db = new MiniORM(
      {
        user: [{ id: 1, name: "Alice" }],
        post: [{ id: 10, title: "Hello", authorId: 1 }],
      },
      relations,
    );

    expect(
      db.post.findMany({
        include: { author: true },
      }),
    ).toEqual([
      {
        id: 10,
        title: "Hello",
        authorId: 1,
        author: { id: 1, name: "Alice" },
      },
    ]);
  });

  test("select and include can be combined", () => {
    const db = new MiniORM(
      {
        user: [{ id: 1, name: "Alice", age: 30 }],
        post: [{ id: 10, title: "Hello", authorId: 1 }],
      },
      relations,
    );

    expect(
      db.user.findMany({
        select: { id: true },
        include: { posts: true },
      }),
    ).toEqual([
      {
        id: 1,
        posts: [{ id: 10, title: "Hello", authorId: 1 }],
      },
    ]);
  });
});
