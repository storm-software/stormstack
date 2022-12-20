"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonCornerRoundingTypes,
  ButtonVariants,
  Heading,
  PropsWithBase,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import { useClickOutside } from "@open-system/shared-ui-components/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

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
  const [opened, setOpened] = useState(false);
  const handleOpen = useCallback(() => !opened && setOpened(true), [opened]);
  const handleClose = useCallback(() => opened && setOpened(false), [opened]);

  const ref = useClickOutside(handleClose);

  return (
    <>
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
      </div>
      <AnimatePresence>
        {opened && (
          <motion.div
            ref={ref}
            className="absolute top-12 left-16 z-20 h-[30rem] w-[50rem] min-w-fit border-4 border-slate-100 bg-slate-800 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <div
              onClick={handleClose}
              className="absolute top-1 right-1 z-30 my-2 mx-2.5 cursor-pointer rounded-full bg-slate-300/80 p-3 font-semibold text-slate-500 transition-colors hover:bg-slate-300 hover:text-slate-900">
              <XMarkIcon className="h-6 w-6 cursor-pointer" />
            </div>

            <div className="flex h-full flex-col gap-5">
              <div className="flex flex-row items-center gap-5">
                {children}
                <div className="flex flex-1">
                  <Heading level={2} className="whitespace-nowrap">
                    {name}
                  </Heading>
                </div>
              </div>
              <div className="font-body-1 text-body-1">{description}</div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
