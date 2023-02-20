"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function RootProvider({
  children,
  ...props
}: BaseComponentProps) {
  return <Provider store={store}>{children}</Provider>;
}
