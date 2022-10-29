/* eslint-disable @typescript-eslint/no-explicit-any */
import { LazyExoticComponent, Suspense, SuspenseProps } from "react";

export interface RouteProps extends SuspenseProps {
  /**
   * The component to render in the route when active
   */
  component: LazyExoticComponent<any>;
}

export const Route = ({ component: Component, ...props }: RouteProps) => {
  return (
    <Suspense {...props}>
      <Component />
    </Suspense>
  );
};
