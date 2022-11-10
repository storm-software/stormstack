import { getAssetPath as getAssetPathStencil } from "@stencil/core";

export function format(first: string, middle: string, last: string): string {
  return (
    (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "")
  );
}

export const getAssetPath = (name: string) => {
  return getAssetPathStencil(`${name}.svg`);
};
