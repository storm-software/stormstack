"use client";

import {
  Link,
  Modal,
  ModalReference
} from "@stormstack/core-client-components";
import {
  Badge,
  Button,
  ButtonCornerRoundingTypes,
  ButtonVariants,
  Heading,
  PropsWithBase
} from "@stormstack/design-system-components";
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
  tags = []
}: TechnologyProps) {
  const ref = useRef<ModalReference>(null);
  const handleOpen = useCallback(
    () => ref && ref?.current && ref?.current?.open?.(),
    []
  );

  return (
    <div
      className="h-fit w-fit gap-4 group flex flex-col justify-center"
      onClick={handleOpen}>
      <div className="h-fit w-fit cursor-pointer transition-transform group-hover:translate-y-0.5 group-hover:scale-110">
        {children}
      </div>
      <Heading
        level={5}
        className="cursor-pointer transition-all group-hover:translate-y-0.5 group-hover:scale-110 group-hover:text-text-hover whitespace-nowrap text-center group-hover:underline">
        {name}
      </Heading>

      <Modal
        ref={ref}
        className="min-h-fit h-[25rem] max-w-[55rem]"
        title={
          <div className="gap-5 flex flex-row items-center">
            {children}
            <div className="flex-1 grow gap-6 flex flex-col justify-around">
              <Heading level={2} className="whitespace-nowrap">
                {name}
              </Heading>
              <div className="gap-2 flex flex-row flex-wrap items-center">
                {tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        }>
        <div className="h-full flex-1 gap-5 flex flex-col">
          <div className="flex-1 grow flex-col">
            <div className="text-md flex-1 grow text-body-1 items-start font-body-1">
              <h2 className="text-lg text-primary font-label-1 underline">
                Description
              </h2>
              <p className="text-md text-body-1 font-body-1">{description}</p>
            </div>
            {experience && (
              <div className="mt-6 flex flex-col">
                <h2 className="text-lg text-primary font-label-1 underline">
                  Experience
                </h2>
                <p className="text-md text-body-1 font-body-1">{experience}</p>
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
