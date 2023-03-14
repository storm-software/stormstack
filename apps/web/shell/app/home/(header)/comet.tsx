import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";

export type CometProps = BaseComponentProps & {
  rotate?: boolean;
};

export default function Comet({
  className,
  rotate = false,
  ...props
}: CometProps) {
  return (
    <div
      className={clsx(
        "absolute flex h-3 w-3 items-center justify-center rounded-full bg-stone-200 shadow-[0px_0px_30px_2px_rgba(0,0,0,0.5)] shadow-white/70 transition-shadow",
        className
      )}>
      <div className="relative">
        <div className="absolute -top-2 -left-[15.5rem] h-4 w-[16rem] rounded-r-full bg-gradient-to-l from-stone-200/60 to-stone-200/0 bg-[length:100%_100%]"></div>
      </div>
    </div>
  );
}
