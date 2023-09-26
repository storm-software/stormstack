"use client";

import { PropsWithBase } from "@stormstack/design-system-components";
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
    <div className="h-fit w-fit cursor-pointer group">
      <div className="mb-7 group-hover:animate-bounce relative">
        <PlusIcon className="w-32" />
        {/*reactions[contentId] ? (
          <CheckIcon className="w-32" />
        ) : (
          <PlusIcon className="w-32" />
        )*/}
        <div className="top-10 w-full absolute flex justify-center text-center">
          <p className="inset-0 mx-auto cursor-pointer font-like-label text-3xl text-primary transition duration-300 group-hover:text-quaternary">
            {count}
          </p>
        </div>
      </div>
      <div className="bottom-0 w-full px-4 pb-2 absolute flex justify-center">
        <p className="cursor-pointer font-like-label text-2xl text-primary transition duration-300 group-hover:text-quaternary group-hover:underline">
          Like {/*reactions[contentId] ? "Liked" : "Like"*/}
        </p>
      </div>
    </div>
  );
}
