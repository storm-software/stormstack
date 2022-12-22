"use client";

import { getUUID } from "@open-system/core-typescript-utilities";
import { PropsWithBase } from "@open-system/design-system-components";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NotificationBanner } from "../notification-banner";
import { Notification } from "../types";

export type NotificationGroupProps = PropsWithBase<{
  notifications?: Notification[];
}>;

/**
 * A component to handle NextJS/application specific logic for the Model design component.
 */
export const NotificationGroup = ({
  children,
  ...props
}: NotificationGroupProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(
      (props.notifications ?? []).map((notification: Notification) => ({
        id: getUUID(),
        ...notification,
      }))
    );
  }, [props.notifications]);

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
              key={notification.id ?? i}
              type={notification.type}
              message={notification.message}
            />
          ))}
        </div>,
        portalRef.current
      )
    : null;
};
