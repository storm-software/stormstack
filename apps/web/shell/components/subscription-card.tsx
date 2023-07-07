"use client";

import { SubscriptionModalForm } from "./subscription-modal-form";
import { ModalReference } from "@open-system/core-client-components";
import {
  BaseComponentProps,
  Card,
} from "@open-system/design-system-components";
import { useCallback, useRef } from "react";

export default function SubscriptionCard({
  className,
  children,
  ...props
}: BaseComponentProps) {
  const modalRef = useRef<ModalReference>(null);
  const handleResetOpen = useCallback(() => {
    modalRef.current?.open();
  }, []);

  return (
    <>
      <Card
        onClick={handleResetOpen}
        className="h-full min-h-[8rem] cursor-pointer"
        title="Subscribe"
        details="Receive email notifications on future updates"
        iconType="bell"
      />
      <SubscriptionModalForm ref={modalRef} />
    </>
  );
}
