export type TemplatePrimitive = null | undefined | boolean | number | string;
export type TemplateValue = TemplatePrimitive | TemplateObject;
export type TemplateObject = { [key: string]: TemplateValue };

export default function renderTemplate(
  template: string,
  data: TemplateObject,
): string {
  throw new Error("Not implemented!");
}
