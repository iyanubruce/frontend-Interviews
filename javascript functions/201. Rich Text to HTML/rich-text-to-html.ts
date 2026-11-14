export interface RichTextRange {
  start: number;
  end: number;
  tag: string;
}

export default function richTextToHTML(
  text: string,
  ranges: Array<RichTextRange>,
): string {
  throw new Error("Not implemented!");
}
