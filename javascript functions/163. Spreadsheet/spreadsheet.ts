export type CellInput = number | string;

export default class Spreadsheet {
  setCell(cellId: string, input: CellInput): void {
    throw new Error("Not implemented!");
  }

  getCell(cellId: string): number {
    throw new Error("Not implemented!");
  }
}
