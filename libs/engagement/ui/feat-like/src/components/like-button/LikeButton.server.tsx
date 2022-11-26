import { PropsWithBase } from "@open-system/shared-ui-components";
import CheckIcon from "../../../../../../../assets/heart-check.svg";
import PlusIcon from "../../../../../../../assets/heart-plus.svg";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
}>;

function LikeButtonServer(props: LikeButtonProps) {
  const count = 5478;
  const isLiked = false;

  return (
    <div className="group z-[100] h-fit w-fit cursor-pointer">
      <div className="relative mb-7 group-hover:animate-bounce">
        {isLiked ? (
          <CheckIcon className="w-40" />
        ) : (
          <PlusIcon className="w-40" />
        )}
        <label className="absolute top-14 left-12 cursor-pointer font-like-label text-2xl text-like-label transition duration-300 group-hover:text-quaternary">
          {count}
        </label>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center px-6 pb-4">
        <label className="cursor-pointer font-like-label text-2xl text-like-label transition duration-300 group-hover:text-quaternary group-hover:underline">
          {isLiked ? "Liked" : "Like"}
        </label>
      </div>
    </div>
  );
}

export default LikeButtonServer;
