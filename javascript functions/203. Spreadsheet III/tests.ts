import { describe, test, expect } from "vitest";

import Spreadsheet from "./spreadsheet-iii";

describe("Spreadsheet", () => {
  describe("getCell", () => {
    test("returns #CYCLE! for a self-reference", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", "=A1 + 1");

      expect(sheet.getCell("A1")).toBe("#CYCLE!");
    });

    test("returns #CYCLE! for a simple indirect cycle", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", "=B1 + 1");
      sheet.setCell("B1", "=A1 + 1");

      expect(sheet.getCell("A1")).toBe("#CYCLE!");
      expect(sheet.getCell("B1")).toBe("#CYCLE!");
    });
  });

  describe("integration", () => {
    test("restores valid values after a cycle is broken", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", "=B1 + 1");
      sheet.setCell("B1", "=A1 + 1");
      sheet.setCell("C1", "=B1 + 2");

      expect(sheet.getCell("C1")).toBe("#CYCLE!");

      sheet.setCell("B1", 3);

      expect(sheet.getCell("A1")).toBe(4);
      expect(sheet.getCell("C1")).toBe(5);
    });
  });
});
