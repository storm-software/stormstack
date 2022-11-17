import React, { ComponentProps } from "react";
import { FontDesignToken } from "../FontDesignToken";

export const FontSizeDesignToken = ({ children }: ComponentProps<any>) => (
  <FontDesignToken
    style={{
      fontSize: children,
    }}
  />
);
