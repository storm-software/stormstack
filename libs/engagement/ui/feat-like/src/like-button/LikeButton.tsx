import { PropsWithBase } from "@open-system/design-system-components";
import clsx from "clsx";
import CheckIcon from "../../assets/heart-check.svg";
import PlusIcon from "../../assets/heart-plus.svg";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
}>;

export function LikeButton({ className, ...props }: LikeButtonProps) {
  const count = 458;
  const isLiked = false;

  return (
    <div className={clsx(className, "group z-like h-fit w-fit cursor-pointer")}>
      <div className="relative mb-7 group-hover:animate-bounce">
        {isLiked ? (
          <CheckIcon className="w-32" />
        ) : (
          <PlusIcon className="w-32" />
        )}
        <label className="absolute top-10 left-[2.7rem] cursor-pointer font-like-label text-2xl text-primary transition duration-300 group-hover:text-quaternary">
          {count}
        </label>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center px-4 pb-2">
        <label className="cursor-pointer font-like-label text-2xl text-primary transition duration-300 group-hover:text-quaternary group-hover:underline">
          {isLiked ? "Liked" : "Like"}
        </label>
      </div>
    </div>
  );
}
