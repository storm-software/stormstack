"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import {
  Notification,
  selectNotificationList,
} from "@open-system/shared-ui-data-access";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { NotificationBanner } from "../notification-banner";

/**
 * The base NotificationGroup component used by the Open System repository
 */
export const NotificationGroup = ({
  children,
  ...props
}: BaseComponentProps) => {
  const notifications = []; //useSelector(selectNotificationList);

  const portalRef = useRef<Element | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    portalRef.current = document?.querySelector?.("#root-portal");
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(
        <div className="fixed z-notification flex h-0 w-full flex-col gap-2 overflow-visible p-5">
          {notifications.map((notification: Notification, i: number) => (
            <NotificationBanner
              key={notification.id}
              id={notification.id}
              type={notification.type}
              message={notification.message}
            />
          ))}
        </div>,
        portalRef.current
      )
    : null;
};
