/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type BaseComponentProps = React.PropsWithRef<
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
    >   >
>;

export type PropsWithBase<
  P extends Record<string, any> = Record<string, never>
> = BaseComponentProps &
      P;
