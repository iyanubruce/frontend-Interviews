import { describe, test, expect } from "vitest";

import cva from "./class-variance-authority";

describe("cva", () => {
  test("returns the base classes when no config is provided", () => {
    expect(cva("btn")()).toEqual("btn");
  });

  test("applies variant classes", () => {
    const button = cva("btn", {
      variants: {
        intent: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
      },
    });

    expect(button({ intent: "secondary" })).toEqual("btn btn-secondary");
  });

  test("uses default variants", () => {
    const button = cva("btn", {
      variants: {
        size: {
          small: "btn-small",
          medium: "btn-medium",
        },
      },
      defaultVariants: {
        size: "medium",
      },
    });

    expect(button()).toEqual("btn btn-medium");
  });

  test("supports boolean variants", () => {
    const button = cva("btn", {
      variants: {
        disabled: {
          true: "btn-disabled",
          false: null,
        },
      },
    });

    expect(button({ disabled: true })).toEqual("btn btn-disabled");
  });
});
