import { describe, test, expect } from "vitest";

import MapWithHistory from "./map-with-history";

describe("MapWithHistory", () => {
  test("constructor starts with an empty store", () => {
    const mapWithHistory = new MapWithHistory();

    expect(mapWithHistory).toBeInstanceOf(MapWithHistory);
    expect(mapWithHistory.get("missing", 1)).toBe("");
  });

  test("returns the latest value at or before the query timestamp", () => {
    const mapWithHistory = new MapWithHistory();

    mapWithHistory.set("language", "JavaScript", 1);
    mapWithHistory.set("language", "TypeScript", 4);

    expect(mapWithHistory.get("language", 1)).toBe("JavaScript");
    expect(mapWithHistory.get("language", 3)).toBe("JavaScript");
    expect(mapWithHistory.get("language", 4)).toBe("TypeScript");
    expect(mapWithHistory.get("language", 10)).toBe("TypeScript");
  });

  test("returns an empty string when the query is earlier than the first timestamp", () => {
    const mapWithHistory = new MapWithHistory();

    mapWithHistory.set("theme", "dark", 5);

    expect(mapWithHistory.get("theme", 4)).toBe("");
  });

  test("keeps separate histories for different keys", () => {
    const mapWithHistory = new MapWithHistory();

    mapWithHistory.set("theme", "dark", 2);
    mapWithHistory.set("locale", "en-US", 2);
    mapWithHistory.set("theme", "light", 6);

    expect(mapWithHistory.get("theme", 5)).toBe("dark");
    expect(mapWithHistory.get("locale", 2)).toBe("en-US");
  });

  test("handles many ordered timestamps for one key", () => {
    const mapWithHistory = new MapWithHistory();

    for (let index = 1; index <= 10_000; index += 1) {
      mapWithHistory.set("feature", `value-${index}`, index * 2);
    }

    for (let index = 1; index <= 10_000; index += 1) {
      expect(mapWithHistory.get("feature", index * 2)).toBe(`value-${index}`);
      expect(mapWithHistory.get("feature", index * 2 + 1)).toBe(
        `value-${index}`,
      );
    }
  });
});
