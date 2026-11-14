import { describe, test, expect } from "vitest";

import Spreadsheet from "./spreadsheet-ii";

describe("Spreadsheet", () => {
  describe("setCell", () => {
    test("stores literal values", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 6);

      expect(sheet.getCell("A1")).toBe(6);
    });
  });

  describe("getCell", () => {
    test("supports subtraction and multiplication with left-to-right evaluation", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 10);
      sheet.setCell("B1", "=A1 - 2 * 3");

      expect(sheet.getCell("B1")).toBe(24);
    });

    test("supports division in formulas", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 8);
      sheet.setCell("B1", "=A1 / 2 + 3");

      expect(sheet.getCell("B1")).toBe(7);
    });
  });

  describe("integration", () => {
    test("can evaluate formulas that depend on formula cells", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 8);
      sheet.setCell("B1", "=A1 / 2 + 3");
      sheet.setCell("C1", "=B1 * 2 - 1");

      expect(sheet.getCell("C1")).toBe(13);
    });
  });
});
