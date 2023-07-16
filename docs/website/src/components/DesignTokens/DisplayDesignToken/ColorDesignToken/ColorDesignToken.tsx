import React, { ComponentProps } from "react";

export const ColorDesignToken = ({ children }: ComponentProps<any>) => (
  <span
    style={{
      backgroundColor: children,
      borderRadius: "2px",
      color: "#aaa",
      padding: "0px 1.5rem",
    }}></span>
);
