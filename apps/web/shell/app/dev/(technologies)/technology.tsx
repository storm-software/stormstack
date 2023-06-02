"use client";

import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonVariants,
  Heading,
  PropsWithBase,
} from "@open-system/design-system-components";
import { Link, Modal, ModalReference  } from "@open-system/core-components";
import { useCallback, useRef } from "react";

type TechnologyProps = PropsWithBase<{
  name: string;
  description: string;
  url: string;
}>;

export default function Technology({
  name,
  description,
  url,
  children,
}: TechnologyProps) {
  const ref = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => ref && ref?.current && ref?.current?.open?.(),
    []
  );

  return (
    <div
      className="group flex h-fit w-fit flex-col justify-center gap-4"
      onClick={handleOpen}>
      <div className="h-fit w-fit cursor-pointer transition-transform group-hover:translate-y-0.5 group-hover:scale-110">
        {children}
      </div>
      <Heading
        level={5}
        className="cursor-pointer whitespace-nowrap text-center transition-all group-hover:translate-y-0.5 group-hover:scale-110 group-hover:text-text-hover group-hover:underline">
        {name}
      </Heading>

      <Modal
        ref={ref}
        title={
          <div className="flex flex-row items-center gap-5">
            {children}
            <div className="flex flex-1">
              <Heading level={2} className="whitespace-nowrap">
                {name}
              </Heading>
            </div>
          </div>
        }>
        <div className="flex h-full flex-col gap-5">
          <div className="font-body-1 text-primary">{description}</div>
          <div className="flex flex-1 flex-row-reverse items-end">
            <Link href={url} target="_blank">
              <Button
                variant={ButtonVariants.GRADIENT}
                rounding={ButtonCornerRoundingTypes.NONE}
                hoverText="Learn More">
                Visit Official Website
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
