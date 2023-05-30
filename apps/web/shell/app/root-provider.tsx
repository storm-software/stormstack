"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";
import { store } from "@open-system/core-data-access";

export default function RootProvider(props: { children: ReactNode }) {
  return <Provider store={store}>{props.children}</Provider>;
}
