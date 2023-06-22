"use client";

import {
  ToastMessage,
  useToastMessagesValue,
} from "@open-system/core-data-access";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Toast } from "../toast";
import clsx from "clsx";

/**
 * The base ToastGroup component used by the Open System repository
 */
export const ToastGroup = () => {
  const messages = useToastMessagesValue();
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
            "fixed z-toast flex h-0 w-full flex-col gap-2 overflow-visible",
            { "pt-6": messages && messages.length }
          )}>
          {messages.map((message: ToastMessage) => (
            <Toast
              key={message.id}
              id={message.id}
              type={message.type}
              summary={message.summary}
            />
          ))}
        </div>,
        portalRef.current
      )
    : null;
};
