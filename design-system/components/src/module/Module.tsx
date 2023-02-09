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
        "flex flex-col gap-8 rounded-2xl border-[1px] border-slate-500 bg-gradient-to-bl from-slate-900 via-slate-900 to-black p-8",
        className
      )}>
      {props.header && (
        <header className="w-full px-4">
          <h1 className="text-7xl font-header-1 text-primary">
            {props.header}
          </h1>
        </header>
      )}
      <main>{children}</main>
      {props.footer && (
        <div className="flex w-full flex-row">{props.footer}</div>
      )}
    </motion.div>
  );
};
