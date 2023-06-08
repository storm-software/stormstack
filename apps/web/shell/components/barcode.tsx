"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";

export default function Barcode({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("group relative h-fit w-fit px-5 py-3", className)}>
      <div className="relative flex h-24 w-fit flex-row items-center justify-center gap-0.5 rounded-lg bg-primary p-3">
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-1.5 bg-black" />
        <div className="h-full w-1.5 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-1.5 bg-black" />
        <div className="h-full w-1 bg-black" />

        <div className="flex h-full flex-col gap-0.5">
          <div className="flex flex-1 grow flex-row gap-0.5">
            <div className="h-full w-1.5 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-1 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-1 bg-black" />
            <div className="h-full w-1 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-1.5 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-0.5 bg-black" />
            <div className="h-full w-1.5 bg-black" />
            <div className="h-full w-1 bg-black" />
            <div className="h-full w-1 bg-black" />
            <div className="h-full w-0.5 bg-black" />
          </div>
          <div className="w-full text-center font-bold leading-3 text-tertiary">
            P.S. Dev.
          </div>
        </div>

        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-1.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-0.5 bg-black" />
        <div className="h-full w-1 bg-black" />
        <div className="h-full w-1 bg-black" />
      </div>

      <div className="absolute left-0 right-0 top-6 animate-scan z-content h-1 w-full bg-red-500 transition-all" />
    </div>
  );
}
