import { BaseComponentProps } from "@stormstack/design-system-components";
import { Link } from "@stormstack/core-client-components";
import clsx from "clsx";

export function Barcode({ className, ...props }: BaseComponentProps) {
  return (
    <Link>
      <div className={clsx("h-fit w-fit px-5 py-3 group relative", className)}>
        <div className="h-24 w-fit gap-0.5 rounded-lg bg-primary p-3 border-gray-600 relative flex flex-row items-center justify-center border-[3px]">
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

          <div className="h-full gap-0.5 flex flex-col">
            <div className="flex-1 grow gap-0.5 flex flex-row">
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
            <div className="w-full font-bold leading-3 text-tertiary text-center">
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

        <div className="left-0 right-0 top-6 h-1 w-full bg-red-500 transition-all absolute z-content hidden animate-scan group-hover:flex" />
      </div>
    </Link>
  );
}
