export type ClassValue = string | false | null | undefined;
export type VariantValue = string | boolean | null | undefined;
export type VariantClasses = Record<string, ClassValue>;
export type VariantSchema = Record<string, VariantClasses>;
export type VariantSelection = Record<string, VariantValue>;

export interface CVAConfig {
  variants?: VariantSchema;
  defaultVariants?: VariantSelection;
}

export default function cva(
  base?: ClassValue,
  config: CVAConfig = {},
): (props?: VariantSelection) => string {
  throw new Error("Not implemented!");
}
