import React, { ComponentProps } from "react";

export const SizeDesignToken = ({ children }: ComponentProps<any>) => (
  <div
    style={{
      width: children,
      height: "4px",
      color: "#aaa",
      backgroundColor: "#7330d5",
      textAlign: "center",
    }}></div>
);
