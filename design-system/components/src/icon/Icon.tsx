"use client";

import type { AnimationItem, LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import { PropsWithBase } from "../types";
import { IconTypes } from "./Icon.types";

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

  let path = null;
  if (type === IconTypes.DOWNLOAD) {
    path = "/static/icons/download.json";
  } else if (type === IconTypes.PENCIL) {
    path = "/static/icons/pencil.json";
  } else if (type === IconTypes.WRENCH) {
    path = "/static/icons/wrench.json";
  } else if (type === IconTypes.BELL) {
    path = "/static/icons/bell.json";
  } else if (type === IconTypes.LIST) {
    path = "/static/icons/list.json";
  } else if (type === IconTypes.ERROR_ALERT) {
    path = "/static/icons/error-alert.json";
  } else if (type === IconTypes.ARROW) {
    path = "/static/icons/arrow.json";
  } else if (type === IconTypes.POST_BOX) {
    path = "/static/icons/post-box.json";
  }

  useEffect(() => {
    import("lottie-web").then(Lottie => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const nextAnimation = lottie.loadAnimation({
        ...props,
        container: ref.current,
        renderer: "svg",
        loop,
        autoplay,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
        path,
      });
      setAnimation(nextAnimation);

      return () => {
        nextAnimation.destroy();
        setAnimation(null);
      };
    }
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
