"use client";

import { Alert, useAlertsValue } from "@open-system/core-data-access";
import { BaseComponentProps } from "@open-system/design-system-components";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertBanner } from "../alert-banner";

/**
 * The base AlertGroup component used by the Open System repository
 */
export const AlertGroup = () => {
  const alerts = useAlertsValue();

  const portalRef = useRef<Element | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    portalRef.current = document?.querySelector?.("#root-portal");
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(
        <div className="fixed z-notification flex h-0 w-full flex-col gap-2 overflow-visible p-5">
          {alerts.map((alert: Alert) => (
            <AlertBanner
              key={alert.id}
              id={alert.id}
              type={alert.type}
              summary={alert.summary}
            />
          ))}
        </div>,
        portalRef.current
      )
    : null;
};
