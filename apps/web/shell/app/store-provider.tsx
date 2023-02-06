"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
//import { Provider } from "inversify-react";
import { Provider } from "react-redux";
import { store } from "../store/store";

//UserDataServiceBinder.with(INVERSION_CONTAINER);
//EngagementApiServiceBinder.with(INVERSION_CONTAINER);

export default function RootProvider({
  children,
  ...props
}: BaseComponentProps) {
  return <Provider store={store}>{children}</Provider>;
}
