import { Router } from "@open-system/shared-ui-feature-routing";
import * as React from "react";
import { routes } from "../routing.config";

export const App = () => {
  return (
    <React.Suspense fallback={null}>
      <Router routes={routes} />
    </React.Suspense>
  );
};

export default App;

