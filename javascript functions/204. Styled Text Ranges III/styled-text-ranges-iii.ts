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

export interface TextReplacement {
  text: string;
  style: TextStyle;
}

export default function replaceTextRange(
  node: StyledText,
  start: number,
  end: number,
  replacement: TextReplacement,
): StyledText {
  throw new Error("Not implemented!");
}
