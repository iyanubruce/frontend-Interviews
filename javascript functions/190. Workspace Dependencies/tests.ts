import { describe, test, expect } from "vitest";

import workspaceDependencies from "./workspace-dependencies";

describe("workspaceDependencies", () => {
  test("returns transitive workspace dependencies in topological order", () => {
    const workspace = {
      "web-app": ["ui-kit"],
      "ui-kit": ["design-tokens", "shared-utils"],
      "design-tokens": [],
      "shared-utils": [],
    };

    expect(workspaceDependencies(workspace, "web-app")).toEqual([
      "design-tokens",
      "shared-utils",
      "ui-kit",
    ]);
  });

  test("deduplicates shared dependencies and ignores external packages", () => {
    const workspace = {
      "web-app": ["ui-kit", "shared-utils", "react"],
      "ui-kit": ["shared-utils", "lodash"],
      "shared-utils": [],
    };

    expect(workspaceDependencies(workspace, "web-app")).toEqual([
      "shared-utils",
      "ui-kit",
    ]);
  });

  test("throws when a reachable cycle is found", () => {
    const workspace = {
      "web-app": ["ui-kit"],
      "ui-kit": ["shared-utils"],
      "shared-utils": ["ui-kit"],
    };

    expect(() => workspaceDependencies(workspace, "web-app")).toThrow(
      "Cycle detected",
    );
  });
});
