"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { TechnologyGroupDetails } from "./technologies";

type TechnologyGroupProps = PropsWithBase<{
  name: string;
  summary?: string | JSX.Element;
  setCurrentGroup: (
    details: TechnologyGroupDetails,
    isDisplayed: boolean
  ) => void;
}>;

export default function TechnologyGroup({
  name,
  summary,
  setCurrentGroup,
  children,
}: TechnologyGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%" });
  useEffect(() => {
    setCurrentGroup({ name, summary }, isInView);
  }, [isInView, name, setCurrentGroup, summary]);

  return (
    <div
      ref={ref}
      className="relative flex h-[45rem] w-fit flex-col justify-center gap-10">
      <div className="flex flex-row items-center justify-center gap-10">
        {children}
      </div>
    </div>
  );
}
