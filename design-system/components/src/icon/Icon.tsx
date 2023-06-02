"use client";

import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { PropsWithBase } from "../types";

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
  ...props
}: IconProps) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (type) {
      setAnimationData(null /*getIconData(type)*/);
    }

    /*async function fetchData() {
      if (type) {
        const data = await getIconData(type);

        if (data) {
          setAnimationData(data);
        }
      }
    }
    fetchData();*/
  }, [type]);

  if (!animationData) {
    return <p>Loading...</p>;
  }

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
};
