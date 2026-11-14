import { describe, test, expect, beforeEach, afterAll } from "vitest";

import createAPI from "./api-client";

describe("createAPI", () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  test("get() calls fetch with the resolved URL", () => {
    const response = Promise.resolve({ ok: true } as Response);
    fetchMock.mockReturnValue(response);

    const result = createAPI("https://example.com/api/").url("/posts").get();

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/posts", {
      method: "GET",
      headers: {},
    });
    expect(result).toBe(response);
  });

  test("setHeaders() passes headers through to fetch", () => {
    fetchMock.mockReturnValue(Promise.resolve({ ok: true } as Response));

    createAPI("https://example.com/api/")
      .url("/posts")
      .setHeaders({
        Authorization: "Bearer xyz",
      })
      .get();

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/posts", {
      method: "GET",
      headers: {
        Authorization: "Bearer xyz",
      },
    });
  });

  test("post(body) forwards the provided body", () => {
    fetchMock.mockReturnValue(Promise.resolve({ ok: true } as Response));
    const body = JSON.stringify({ name: "Alice" });

    createAPI("https://example.com/")
      .url("/users")
      .setHeaders({
        "Content-Type": "application/json",
      })
      .post(body);

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  });
});
