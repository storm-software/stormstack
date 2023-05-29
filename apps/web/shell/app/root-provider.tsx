"use client";

import AppHeaderStateProvider from "../components/app-header-state-provider";
import { ReactNode } from "react";

export default function RootProvider(props: { children: ReactNode }) {
  return <AppHeaderStateProvider>{props.children}</AppHeaderStateProvider>;
}
