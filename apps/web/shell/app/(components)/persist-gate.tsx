"use client";

import {
  PersistGate as ExtPersistGate,
  PersistGateProps as ExtPersistGateProps,
} from "redux-persist/integration/react";
import { persistor } from "../../store/store";

export type PersistGateProps = Omit<ExtPersistGateProps, "persistor">;

export default function PersistGate({ children, ...props }: PersistGateProps) {
  return (
    <ExtPersistGate {...props} persistor={persistor}>
      {children}
    </ExtPersistGate>
  );
}
