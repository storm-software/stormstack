/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type PropsWithBase<
  P extends Record<string, any> = Record<string, never>
> = React.PropsWithRef<
  React.PropsWithChildren<
    Partial<
      Pick<
        React.HTMLAttributes<any>,
        | "className"
        | "id"
        | "lang"
        | "translate"
        | "slot"
        | "role"
        | "suppressContentEditableWarning"
        | "suppressHydrationWarning"
      > & { key?: React.Key }
    > &
      P
  >
>;
