import { Route } from "@open-system/shared-ui-feature-routing";
import React from "react";
import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Route
        component={React.lazy(() =>
          import(
            /* webpackChunkName: "web-landing" */ "web-landing/Module"
          ).then(module => ({
            default: module.App,
          }))
        )}
        fallback={<>Loading</>}
      />
    ),
  },
];
