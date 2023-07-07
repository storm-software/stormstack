"use client";

import { ReactNode } from "react";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { RelayProvider } from "../relay/hooks";

export default function PageProvider(props: {
  children: ReactNode;
  initialRecords?: RecordMap;
}) {
  const { initialRecords, children } = props;

  return (
    <RelayProvider initialRecords={initialRecords}>{children}</RelayProvider>
  );
}
