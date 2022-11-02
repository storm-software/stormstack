import React, { ComponentProps } from "react";
import { FontDesignToken } from "../FontDesignToken";

export const FontWeightDesignToken = ({ children }: ComponentProps<any>) => (
  <FontDesignToken
    style={{
      fontWeight: children,
      fontSize: "24px",
    }}
  />
);
