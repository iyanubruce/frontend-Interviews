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

export default function setTextRangeStyle(
  node: StyledText,
  start: number,
  end: number,
  style: TextStyle,
): StyledText {
  throw new Error("Not implemented!");
}
