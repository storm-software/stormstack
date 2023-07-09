"use client";

import { Link } from "@open-system/core-client-components";
import {
  NotificationMessage,
  useNotificationsValue,
  useSetNotifications,
} from "@open-system/core-client-data-access";
import {
  LinkVariants,
  Notification,
  NotificationVariants,
} from "@open-system/design-system-components";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The base NotificationGroup component used by the Open System repository
 */
export const NotificationGroup = () => {
  const messages = useNotificationsValue();
  const { remove } = useSetNotifications();
  const portalRef = useRef<Element | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    portalRef.current = document?.querySelector?.("#root-portal");
    setMounted(true);
  }, []);

  return mounted && portalRef.current
    ? createPortal(
        <div
          className={clsx(
            "fixed z-notification flex h-0 w-full flex-row-reverse overflow-visible",
            { "pr-6 pt-6": messages && messages.length }
          )}>
          <div className="flex flex-col gap-2">
            {messages.map((message: NotificationMessage) => (
              <Notification
                key={message.id}
                id={message.id}
                variant={message.type as NotificationVariants}
                onClose={() => remove(message.id)}
                body={message.message}
                actions={
                  message.link && (
                    <div className="flex w-full flex-row-reverse">
                      <Link
                        variant={LinkVariants.QUATERNARY}
                        href={message.link.href}>
                        {message.link.text}
                      </Link>
                    </div>
                  )
                }
              />
            ))}
          </div>
        </div>,
        portalRef.current
      )
    : null;
};
