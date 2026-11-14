export type TextStyle = string;

export interface StyledTextRange {
  start: number;
  end: number;
  style: TextStyle;
}

export interface StyledText {
  text: string;
  ranges: Array<StyledTextRange>;
}

export default function sliceStyledText(
  node: StyledText,
  start: number,
  end: number,
): StyledText {
  throw new Error("Not implemented!");
}
