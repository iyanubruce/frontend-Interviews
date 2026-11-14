export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

export interface StyledTextRange {
  start: number;
  end: number;
  style: TextStyle;
}

export interface StyledText {
  text: string;
  ranges: Array<StyledTextRange>;
}

export type TextStylePatch = Partial<TextStyle>;

export default function patchTextRangeStyle(
  node: StyledText,
  start: number,
  end: number,
  patch: TextStylePatch,
): StyledText {
  throw new Error("Not implemented!");
}
