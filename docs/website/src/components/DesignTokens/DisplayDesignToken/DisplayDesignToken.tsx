import React from "react";
import { ColorDesignToken } from "./ColorDesignToken/ColorDesignToken";
import { FontWeightDesignToken } from "./FontDesignToken/FontFamilyDesignToken/FontFamilyDesignToken";
import { FontSizeDesignToken } from "./FontDesignToken/FontSizeDesignToken/FontSizeDesignToken";
import { FontFamilyDesignToken } from "./FontDesignToken/FontWeightDesignToken/FontWeightDesignToken";
import { SizeDesignToken } from "./SizeDesignToken/SizeDesignToken";

export const DisplayDesignToken = ({ token, value }) => {
  const tokenValue = value?.trim();
  if (!tokenValue) {
    return null;
  }

  if (token?.includes("color") && value?.includes("#")) {
    return <ColorDesignToken>{value?.trim()}</ColorDesignToken>;
  } else if (token?.includes("font-family")) {
    return <FontFamilyDesignToken>{tokenValue}</FontFamilyDesignToken>;
  } else if (token?.includes("font-size")) {
    return <FontSizeDesignToken>{tokenValue}</FontSizeDesignToken>;
  } else if (token?.includes("font-weight")) {
    return <FontWeightDesignToken>{tokenValue}</FontWeightDesignToken>;
  } else if (
    token?.includes("spacing") ||
    token?.includes("padding") ||
    token?.includes("margin") ||
    token?.includes("gap")
  ) {
    return <SizeDesignToken>{value?.trim()}</SizeDesignToken>;
  } else {
    return null;
  }
};
