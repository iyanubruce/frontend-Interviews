export type TemplateValue = null | undefined | boolean | number | string;
export type TemplateData = Record<string, TemplateValue>;

export default function renderTemplate(
  template: string,
  data: TemplateData,
): string {
  throw new Error("Not implemented!");
}
