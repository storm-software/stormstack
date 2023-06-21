import clsx from "clsx";
import { motion } from "framer-motion";
import { PropsWithBase } from "../types";

export type ModuleProps = PropsWithBase<{
  /**
   * The variant style of the divider
   */
  header?: JSX.Element | string;

  /**
   * The variant style of the divider
   */
  footer?: JSX.Element | string;
}>;

/**
 * The base Module component used by the Open System repository
 */
export const Module = ({ className, children, ...props }: ModuleProps) => {
  return (
    <motion.div
      layout
      className={clsx(
        "relative flex rounded-2xl border-[1px] border-slate-600",
        className
      )}>
      <div className="absolute z-10 h-full w-full rounded-2xl backdrop-blur-md backdrop-brightness-110" />
      <div className="z-20 h-full w-full rounded-2xl p-8">
        <div className="flex flex-col gap-10 h-full w-full">
          {props.header && (
            <header className="w-full px-4">
              <h1 className="text-7xl font-header-1 text-primary">
                {props.header}
              </h1>
            </header>
          )}
          <div className="h-full flex flex-1 grow">{children}</div>
          {props.footer && (
            <div className="w-full h-full items-end">{props.footer}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
