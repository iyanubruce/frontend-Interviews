import { describe, test, expect } from "vitest";

import Spreadsheet from "./spreadsheet";

describe("Spreadsheet", () => {
  describe("setCell", () => {
    test("stores literal values", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 10);

      expect(sheet.getCell("A1")).toBe(10);
    });
  });

  describe("getCell", () => {
    test("evaluates formulas with references and numeric literals", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 10);
      sheet.setCell("B1", "=A1 + 5 + C1");

      expect(sheet.getCell("B1")).toBe(15);
    });
  });

  describe("integration", () => {
    test("reflects updates across chained formulas", () => {
      const sheet = new Spreadsheet();

      sheet.setCell("A1", 1);
      sheet.setCell("B1", "=A1 + 2");
      sheet.setCell("C1", "=B1 + 3");

      expect(sheet.getCell("C1")).toBe(6);

      sheet.setCell("A1", 4);

      expect(sheet.getCell("C1")).toBe(9);
    });
  });
});
