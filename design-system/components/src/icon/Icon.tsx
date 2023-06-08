"use client";

import type { AnimationItem, LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import { PropsWithBase } from "../types";
import { IconTypes } from "./Icon.types";
import { getIconData } from "./Icon.utils";

export type IconProps = PropsWithBase<{
  /**
   * The type of the icon to render
   */
  type?: string;
  loop?: boolean;
  autoplay?: boolean;
  isStopped?: boolean;
  isPaused?: boolean;
  height?: number | string;
  width?: number | string;
}>;

export const Icon = ({
  type,
  loop = false,
  autoplay = false,
  isStopped,
  ...props
}: IconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [animation, setAnimation] = useState<AnimationItem | null>(null);

  

  useEffect(() => {
    import("lottie-web").then(Lottie => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current && type) {
      const nextAnimation = lottie.loadAnimation({
        ...props,
        container: ref.current,
        renderer: "svg",
        loop,
        autoplay,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
        path: getIconData(type),
      });
      setAnimation(nextAnimation);

      return () => {
        nextAnimation.destroy();
        setAnimation(null);
      };
    }

    return () => {};
  }, [lottie]);

  useEffect(() => {
    if (animation) {
      if (!isStopped) {
        animation.play();
      } else {
        animation.stop();
      }
    }
  }, [animation, isStopped]);

  return <div ref={ref} />;
};
