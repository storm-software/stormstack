"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import CheckIcon from "../../assets/heart-check.svg";
import PlusIcon from "../../assets/heart-plus.svg";
import { useIsLiked } from "../use-is-liked";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
  count: number;
  isLiked: boolean;
}>;

export function LikeButton({ pageId, count, ...props }: LikeButtonProps) {
  const [isLiked, toggleIsLiked] = useIsLiked(pageId, props.isLiked);

  return (
    <div onClick={toggleIsLiked} className="group h-fit w-fit cursor-pointer">
      <div className="relative mb-7 group-hover:animate-bounce">
        {isLiked ? (
          <CheckIcon className="w-32" />
        ) : (
          <PlusIcon className="w-32" />
        )}
        <div className="absolute top-10 flex w-full justify-center text-center">
          <label className="inset-0 mx-auto cursor-pointer font-like-label text-3xl text-primary transition duration-300 group-hover:text-quaternary">
            {count}
          </label>
        </div>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center px-4 pb-2">
        <label className="cursor-pointer font-like-label text-2xl text-primary transition duration-300 group-hover:text-quaternary group-hover:underline">
          {isLiked ? "Liked" : "Like"}
        </label>
      </div>
    </div>
  );
}
