"use client";

import { BaseRefComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { ForwardedRef, MutableRefObject, forwardRef } from "react";
// import BoxLogo from "../../../../../../assets/box-logo-primary.svg";
// import { GlitchCanvasManager } from "./Glitch.utils";

/*let isLoaded = false;
let glitch;



function draw() {
  clear();
  background(0);

  if (isLoaded) {

  }

  // fill(255, 255, 255);
  // textSize(14);
  // text('FPS: ' + floor(frameRate()), 20, 30);

}*/

export type ConfettiProps = BaseRefComponentProps & {
  triggerRef: MutableRefObject<HTMLElement>;
};

export const Confetti = forwardRef<HTMLCanvasElement, ConfettiProps>(
  (
    { className, triggerRef, children, ...props }: ConfettiProps,
    ref: ForwardedRef<HTMLCanvasElement>
  ) => {
    return (
      <canvas
        ref={ref}
        className={clsx(
          "pointer-events-none fixed z-[2] h-[10vh] w-[20vw]",
          className
        )}
        {...props}>
        {children}
      </canvas>
    );
  }
);
