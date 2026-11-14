import { describe, test, expect } from "vitest";

import cva from "./class-variance-authority-ii";

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

  test("applies a matching compound variant after normal variants", () => {
    const button = cva("btn", {
      variants: {
        intent: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
        size: {
          small: "btn-small",
          medium: "btn-medium",
        },
      },
      compoundVariants: [
        {
          intent: "primary",
          size: "medium",
          class: "btn-primary-medium",
        },
      ],
    });

    expect(button({ intent: "primary", size: "medium" })).toEqual(
      "btn btn-primary btn-medium btn-primary-medium",
    );
  });

  test("uses default variants when matching compound variants", () => {
    const button = cva("btn", {
      variants: {
        intent: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
      },
      defaultVariants: {
        intent: "primary",
      },
      compoundVariants: [
        {
          intent: "primary",
          class: "btn-primary-default",
        },
      ],
    });

    expect(button()).toEqual("btn btn-primary btn-primary-default");
  });

  test("supports arrays of accepted values in compound variants", () => {
    const badge = cva("badge", {
      variants: {
        tone: {
          info: "badge-info",
          warning: "badge-warning",
        },
        rounded: {
          true: "badge-rounded",
          false: null,
        },
      },
      compoundVariants: [
        {
          tone: ["info", "warning"],
          rounded: true,
          class: "badge-highlighted",
        },
      ],
    });

    expect(badge({ tone: "warning", rounded: true })).toEqual(
      "badge badge-warning badge-rounded badge-highlighted",
    );
  });
});
