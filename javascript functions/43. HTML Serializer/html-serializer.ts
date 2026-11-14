type HTMLNode = string | HTMLElementNode;

type HTMLElementNode = {
  tag: string;
  children: HTMLNode[];
};

export default function serializeHTML(root: HTMLElementNode): string {
  throw new Error("Not implemented!");
}
