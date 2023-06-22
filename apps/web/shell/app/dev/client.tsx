"use client";

import { HorizontalSeparator } from "@open-system/core-components";
import { Spinner } from "@open-system/design-system-components";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Introduction from "./(introduction)/introduction";

const Stack = dynamic(() => import("./(stack)/stack"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="flex h-full w-full items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  ),
});

const Technologies = dynamic(() => import("./(technologies)/technologies"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="flex h-[375vh] w-full items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  ),
});

const Architecture = dynamic(() => import("./(architecture)/architecture"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="flex h-[375vh] w-full items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  ),
});

export default function Client() {
  const introductionRef = useRef(null);
  const stackRef = useRef(null);
  const technologiesRef = useRef(null);

  const isIntroductionInView = useInView(introductionRef, { once: true });
  const isStackInView = useInView(stackRef, { once: true });
  const isTechnologiesInView = useInView(technologiesRef, { once: true });

  return (
    <main className="relative flex flex-col gap-16">
      <div ref={introductionRef}>
        <Introduction />
      </div>

      <HorizontalSeparator />

      <div ref={stackRef} className="mt-10">
        {isIntroductionInView && <Stack />}
      </div>

      <div ref={technologiesRef}>{isStackInView && <Technologies />}</div>

      <HorizontalSeparator />

      <div className="mt-20">{isTechnologiesInView && <Architecture />}</div>
    </main>
  );
}
