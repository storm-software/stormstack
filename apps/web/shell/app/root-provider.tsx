"use client";

import { store } from "@stormstack/core-client-data-access";
// import { WunderGraphRelayProvider } from "@stormstack/data-catalog-graphql";
import { Provider } from "jotai";
import { ReactNode } from "react";

export default function RootProvider(props: { children: ReactNode }) {
  return <Provider store={store}>{props.children}</Provider>;
}
