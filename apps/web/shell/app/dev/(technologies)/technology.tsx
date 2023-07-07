"use client";

import {
  Link,
  Modal,
  ModalReference,
} from "@open-system/core-client-components";
import {
  Badge,
  Button,
  ButtonCornerRoundingTypes,
  ButtonVariants,
  Heading,
  PropsWithBase,
} from "@open-system/design-system-components";
import { useCallback, useRef } from "react";

type TechnologyProps = PropsWithBase<{
  name: string;
  description: string;
  experience?: string;
  url: string;
  tags?: string[];
}>;

export default function Technology({
  name,
  description,
  experience,
  url,
  children,
  tags = [],
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
        className="h-[25rem] min-h-fit max-w-[55rem]"
        title={
          <div className="flex flex-row items-center gap-5">
            {children}
            <div className="flex flex-1 grow flex-col justify-around gap-6">
              <Heading level={2} className="whitespace-nowrap">
                {name}
              </Heading>
              <div className="flex flex-row flex-wrap items-center gap-2">
                {tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        }>
        <div className="flex h-full flex-1 flex-col gap-5">
          <div className="flex-1 grow flex-col">
            <div className="text-md flex-1 grow items-start font-body-1 text-body-1">
              <h2 className="text-lg font-label-1 text-primary underline">
                Description
              </h2>
              <p className="text-md font-body-1 text-body-1">{description}</p>
            </div>
            {experience && (
              <div className="mt-6 flex flex-col">
                <h2 className="text-lg font-label-1 text-primary underline">
                  Experience
                </h2>
                <p className="text-md font-body-1 text-body-1">{experience}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row-reverse items-end">
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
