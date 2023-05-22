"use client";

import Lottie from "react-lottie";
import { PropsWithBase } from "../types";
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

export function Icon({
  type,
  loop = false,
  autoplay = false,
  ...props
}: IconProps) {
  const animationData = getIconData(type);

  return (
    <Lottie
      {...props}
      options={{
        loop,
        autoplay,
        animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
    />
  );
}
