"use client";

import { HorizontalSeparator } from "@stormstack/core-client-components";
import { Spinner } from "@stormstack/design-system-components";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Introduction from "./(introduction)/introduction";

const Stack = dynamic(() => import("./(stack)/stack"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="h-full w-full flex items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  )
});

const Technologies = dynamic(() => import("./(technologies)/technologies"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="w-full flex h-[375vh] items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  )
});

const Architecture = dynamic(() => import("./(architecture)/architecture"), {
  loading: () => (
    <div
      aria-label="Loading..."
      role="status"
      className="w-full flex h-[375vh] items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  )
});

export default function Client() {
  const introductionRef = useRef(null);
  const stackRef = useRef(null);
  const technologiesRef = useRef(null);

  const isIntroductionInView = useInView(introductionRef, { once: true });
  const isStackInView = useInView(stackRef, { once: true });
  const isTechnologiesInView = useInView(technologiesRef, { once: true });

  return (
    <main className="gap-16 relative flex flex-col">
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
