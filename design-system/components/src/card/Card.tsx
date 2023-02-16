"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, useCallback, useRef, useState } from "react";
import { PropsWithBase } from "../types";

export type CardProps = PropsWithBase<{
  /**
   * The title displayed in the header section
   */
  title: JSX.Element | string;

  /**
   * The details text displayed to the right of the summary text (in a smaller style) in the header section
   */
  details?: JSX.Element | string;
}>;

/**
 * The base Card component used by the Open System repository
 */
export const Card = ({ children, title, details, className }: CardProps) => {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  const ref = useRef(null);
  const handleMouseMove = useCallback(
    (event: MouseEvent<Element, MouseEvent>) => {
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

        let reference = ref.current.offsetParent;

        while (reference) {
          offset.left += reference.offsetLeft;
          offset.top += reference.offsetTop;
          reference = reference.offsetParent;
        }

        setMousePosition({
          x: (position.x - offset.left - offset.width / 2) / (offset.width / 2),
          y:
            (position.y - offset.top - offset.height / 2) / (offset.height / 2),
          width: offset.width,
          height: offset.height,
        });
      }
    },
    []
  );
  const handleHoverEnd = useCallback(() => {
    if (ref.current) {
      setMousePosition({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      layout
      onMouseMove={handleMouseMove}
      onHoverEnd={handleHoverEnd}
      style={{
        rotateX: mousePosition.x * -30,
        rotateY: mousePosition.y * -20,
      }}
      className={clsx(
        "group relative flex flex-col gap-2 rounded-xl border-[1px] border-slate-500 bg-gradient-to-bl from-bg-1 via-bg-1 to-black transition-shadow hover:border-hover-link-2 hover:shadow-2xl hover:shadow-indigo-500/50",
        className
      )}>
      <div className="z-20 flex flex-col gap-2 p-4">
        <div className="flex flex-col gap-0">
          {typeof title === "string" ? (
            <h2 className="font-label-4 text-4xl font-bold text-primary transition-colors group-hover:text-hover-link-2">
              {title}
            </h2>
          ) : (
            <div>{title}</div>
          )}

          {typeof details === "string" ? (
            <div className="flex flex-row items-end gap-2">
              <label className="text-md mb-0.5 font-label-3 text-slate-400 transition-colors hover:cursor-pointer group-hover:text-hover-link-2">
                {details}
              </label>
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
    </motion.div>
  );
};
