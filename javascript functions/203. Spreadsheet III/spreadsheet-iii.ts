export type CellInput = number | string;
export type CellValue = number | "#CYCLE!";

export default class Spreadsheet {
  setCell(cellId: string, input: CellInput): void {
    throw new Error("Not implemented!");
  }

  getCell(cellId: string): CellValue {
    throw new Error("Not implemented!");
  }
}
