export interface CanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function readingOrder(
  elements: Array<CanvasElement>,
): Array<string> {
  throw new Error("Not implemented!");
}
