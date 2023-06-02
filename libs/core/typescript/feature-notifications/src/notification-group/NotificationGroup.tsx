"use client";

import { AlertScope, useAlerts } from "@open-system/core-data-access";
import { BaseComponentProps } from "@open-system/design-system-components";
import { ScopeProvider } from "jotai-molecules";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NotificationBanner } from "../notification-banner";

/**
 * The base NotificationGroup component used by the Open System repository
 */
export const NotificationGroup = ({
  children,
  ...props
}: BaseComponentProps) => {
  const alerts = useAlerts();

  const portalRef = useRef<Element | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    portalRef.current = document?.querySelector?.("#root-portal");
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(
        <div className="fixed z-notification flex h-0 w-full flex-col gap-2 overflow-visible p-5">
          {Object.values(alerts).map((alert: any, i) => (
            <ScopeProvider key={i} scope={AlertScope} value={alert.id}>
              <NotificationBanner id={alert.id} />
            </ScopeProvider>
          ))}
        </div>,
        portalRef.current
      )
    : null;
};
