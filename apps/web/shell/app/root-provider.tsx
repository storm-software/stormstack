"use client";

import { store } from "@open-system/core-data-access";
// import { WunderGraphRelayProvider } from "@open-system/data-catalog-graphql";
import { Provider } from "jotai";
import { ReactNode } from "react";

export default function RootProvider(props: { children: ReactNode }) {
  return <Provider store={store}>{props.children}</Provider>;
}
