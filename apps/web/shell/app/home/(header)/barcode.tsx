import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";

export default function Barcode({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("relative h-fit w-fit px-10 py-3", className)}>
      <div className="flex h-24 w-fit flex-row items-center justify-center gap-1 rounded-lg bg-primary p-3">
        <div className="h-full w-0.5 bg-slate-900"></div>
        <div className="h-full w-0.5 bg-slate-900"></div>
        <div className="h-full w-2 bg-slate-900"></div>

        <div className="h-full w-2 bg-slate-900"></div>
        <div className="h-full w-2 bg-slate-900"></div>
        <div className="h-full w-1 bg-slate-900"></div>

        <div className="flex h-full flex-col gap-1">
          <div className="flex flex-1 grow flex-row gap-1">
            <div className="h-full w-2 bg-slate-900"></div>
            <div className="h-full w-2 bg-slate-900"></div>
            <div className="h-full w-1 bg-slate-900"></div>

            <div className="h-full w-0.5 bg-slate-900"></div>
            <div className="h-full w-0.5 bg-slate-900"></div>

            <div className="h-full w-1 bg-slate-900"></div>

            <div className="h-full w-1 bg-slate-900"></div>
            <div className="h-full w-1 bg-slate-900"></div>

            <div className="h-full w-2 bg-slate-900"></div>
          </div>

          <div className="w-full text-center font-bold leading-3 text-purple-700">
            P.S. Dev.
          </div>
        </div>

        <div className="h-full w-0.5 bg-slate-900"></div>
        <div className="h-full w-0.5 bg-slate-900"></div>
        <div className="h-full w-1 bg-slate-900"></div>

        <div className="h-full w-2 bg-slate-900"></div>
        <div className="h-full w-2 bg-slate-900"></div>
        <div className="h-full w-2 bg-slate-900"></div>

        <div className="h-full w-1 bg-slate-900"></div>
      </div>

      {/*<div className="absolute left-0 right-0 top-6 h-1 animate-scan bg-red-500/80"></div>*/}
    </div>
  );
}
