"use client";

import { SubscriptionModalForm } from "./subscription-modal-form";
import { ModalReference } from "@stormstack/core-client-components";
import { BaseComponentProps, Card } from "@stormstack/design-system-components";
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
        className="h-full cursor-pointer min-h-[8rem]"
        title="Subscribe"
        details="Receive email notifications on future updates"
        iconType="bell"
      />
      <SubscriptionModalForm ref={modalRef} />
    </>
  );
}
