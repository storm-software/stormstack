import React, { ComponentProps } from "react";
import { FontDesignToken } from "../FontDesignToken";

export const FontFamilyDesignToken = ({ children }: ComponentProps<any>) => (
  <FontDesignToken
    style={{
      fontFamily: children,
      fontSize: "24px",
    }}
  />
);
