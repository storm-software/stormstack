"use client";

import { PropsWithBase } from "@stormstack/design-system-components";
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
  children
}: TechnologyGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-25%" });
  useEffect(() => {
    setCurrentGroup({ name, summary }, isInView);
  }, [isInView, name, setCurrentGroup, summary]);

  return (
    <div
      ref={ref}
      className="w-fit gap-10 relative flex h-[45rem] flex-col justify-center">
      <div className="gap-10 flex flex-row items-center justify-center">
        {children}
      </div>
    </div>
  );
}
