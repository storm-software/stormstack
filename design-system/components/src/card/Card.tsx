"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, useCallback, useRef, useState } from "react";
import { Badge } from "../badge";
import { BadgeBorderThickness, BadgeVariants } from "../badge/Badge.types";
import { Icon } from "../icon";
import { PropsWithBase } from "../types";
import { useRipple } from "../utilities";

export type CardProps = PropsWithBase<{
  /**
   * The title displayed in the header section
   */
  title: JSX.Element | string;

  /**
   * The details text displayed to the right of the summary text (in a smaller style) in the header section
   */
  details?: JSX.Element | string;

  /**
   * The text displayed in the badge in the top right of the title
   */
  badge?: JSX.Element | string;

  /**
   * An icon to display on the left side of the card
   */
  iconType?: string;

  /**
   * Event handler for card click event
   */
  onClick?: (event: MouseEvent) => void;
}>;

/**
 * The base Card component used by the Open System repository
 */
export const Card = ({
  children,
  title,
  badge,
  details,
  iconType,
  className,
  onClick,
}: CardProps) => {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  const ref = useRef<HTMLDivElement>(null);
  useRipple(ref);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const position = {
        x: event.pageX,
        y: event.pageY,
      };

      const offset = {
        left: ref.current.offsetLeft,
        top: ref.current.offsetTop,
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      };

      let reference = ref.current.offsetParent as HTMLDivElement;
      while (reference) {
        offset.left += reference.offsetLeft;
        offset.top += reference.offsetTop;
        reference = reference.offsetParent as HTMLDivElement;
      }

      setMousePosition({
        x: (position.x - offset.left - offset.width / 2) / (offset.width / 2),
        y: (position.y - offset.top - offset.height / 2) / (offset.height / 2),
        width: offset.width,
        height: offset.height,
      });
    }
  }, []);

  const [isStopped, setIsStopped] = useState(true);
  const handleHoverStart = useCallback(() => {
    if (isStopped) {
      setIsStopped(false);
    }
  }, [isStopped]);
  const handleHoverEnd = useCallback(() => {
    if (!isStopped) {
      setIsStopped(true);
    }

    if (ref.current) {
      setMousePosition({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
  }, [isStopped]);

  return (
    <motion.div
      layout
      onMouseMove={handleMouseMove}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={onClick}
      style={{
        rotateX: mousePosition.x * -30,
        rotateY: mousePosition.y * -20,
      }}
      className={clsx(
        "group relative rounded-xl border-[1px] border-slate-600 active:scale-95",
        className
      )}>
      <div className="absolute z-10 h-full w-full rounded-xl backdrop-blur-md backdrop-brightness-110" />
      <div
        ref={ref}
        className="ripple-container relative z-20 h-full w-full overflow-hidden rounded-xl transition-shadow group-hover:border-hover-link-2 group-hover:shadow-[0_0_25px_5px_rgba(0,0,0,0.01)] group-hover:shadow-teal-400/50">
        <div className="ripple-inner flex h-full w-full flex-row items-center gap-2">
          {badge && (
            <div className="absolute left-0 right-0 top-0 flex h-fit w-full flex-row-reverse p-3">
              {typeof badge === "string" ? (
                <Badge
                  variant={BadgeVariants.SECONDARY}
                  borderThickness={BadgeBorderThickness.THIN}>
                  {badge}
                </Badge>
              ) : (
                badge
              )}
            </div>
          )}
          <div className="h-fit w-fit pl-6">
            {iconType && (
              <div className="h-20 w-16">
                <Icon
                  className="group-hover:stroke-hover-link-2"
                  type={iconType}
                  autoplay={!isStopped}
                  loop={!isStopped}
                  isStopped={isStopped}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="z-20 flex flex-col gap-2 p-4">
              <div className="flex flex-col gap-0">
                {typeof title === "string" ? (
                  <h2 className="text-left font-label-4 text-4xl font-bold text-primary transition-colors group-hover:text-hover-link-2">
                    {title}
                  </h2>
                ) : (
                  <div>{title}</div>
                )}

                {typeof details === "string" ? (
                  <div className="flex flex-row items-end gap-2">
                    <p className="text-md mb-0.5 text-left font-label-3 text-slate-400 transition-colors hover:cursor-pointer group-hover:text-hover-link-2">
                      {details}
                    </p>
                  </div>
                ) : (
                  <div>{details}</div>
                )}

                <AnimatePresence>
                  <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}>
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
