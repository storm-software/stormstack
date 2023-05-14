"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import CheckIcon from "../../assets/heart-check.svg";
import PlusIcon from "../../assets/heart-plus.svg";

export type LikeButtonProps = PropsWithBase<{
  contentId: string;
  count: number;
}>;

export function LikeButton({ contentId, count, ...props }: LikeButtonProps) {
  /*const router = useRouter();
  const [, startTransition] = useTransition();

  const reactions = useSelector(selectReactionHistory);
  const dispatch = useDispatch();

  const [addReaction] = useAddReactionMutation();
  const [removeReaction] = useRemoveReactionMutation();

  const toggleIsLiked = useCallback(async () => {
    if (reactions?.[contentId]) {
      dispatch(removeReactionHistory(contentId));

      await removeReaction({
        contentId,
      }).unwrap();
    } else {
      dispatch(
        addReactionHistory({
          contentId,
          type: reactions[contentId] ? null : AddReactionRequestTypeEnum.LIKE,
        })
      );

      await addReaction({
        contentId,
        body: { type: AddReactionRequestTypeEnum.LIKE },
      }).unwrap();
    }

    startTransition(() => {
      router.refresh();
    });
  }, [addReaction, contentId, dispatch, reactions, removeReaction, router]);*/

  return (
    <div className="group h-fit w-fit cursor-pointer">
      <div className="relative mb-7 group-hover:animate-bounce">
        {true === false /*reactions[contentId]*/ ? (
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
          {true === false /*reactions[contentId]*/ ? "Liked" : "Like"}
        </label>
      </div>
    </div>
  );
}
