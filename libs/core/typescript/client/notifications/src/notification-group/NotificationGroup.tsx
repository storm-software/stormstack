"use client";

import { Link } from "@stormstack/core-client-components";
import {
  NotificationMessage,
  useNotificationsValue,
  useSetNotifications
} from "@stormstack/core-client-data-access";
import {
  LinkVariants,
  Notification,
  NotificationVariants
} from "@stormstack/design-system-components";
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
            "h-0 w-full fixed z-notification flex flex-row-reverse overflow-visible",
            { "pr-6 pt-6": messages && messages.length }
          )}>
          <div className="gap-2 flex flex-col">
            {messages.map((message: NotificationMessage) => (
              <Notification
                key={message.id}
                id={message.id}
                variant={message.type as NotificationVariants}
                onClose={() => remove(message.id)}
                body={message.message}
                actions={
                  message.link && (
                    <div className="w-full flex flex-row-reverse">
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
