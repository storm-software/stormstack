import {
  createBrowserRouter,
  RouterProvider,
  RouterProviderProps,
  RouteObject,
} from "react-router-dom";
import { useMemo } from "react";

export type RouterProps = Omit<RouterProviderProps, "router"> & {
  basename?: string;
  window?: Window;
  routes: RouteObject[];
};

export const Router = ({
  basename = "/",
  window,
  routes = [],
}: RouterProps) => {
  return (
    <RouterProvider
      router={useMemo(
        () => createBrowserRouter(routes, { basename, window }),
        [basename, routes, window]
      )}
    />
  );
};

