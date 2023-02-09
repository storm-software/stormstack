import { PropsWithBase } from "@open-system/design-system-components";
import LikeButtonClient from "./like-button.client";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
}>;

export default async function LikeButton({
  className,
  pageId,
  ...props
}: LikeButtonProps) {
  /*const api = INVERSION_CONTAINER.get(AbstractReactionsApi);

  const resp = await api.getArticleReaction({
    id: pageId,
    type: "like",
    userId: "PSUL",
  });
  console.log(resp);
  const userLikeHistory = cookies()?.get?.(
    UserLikeHistoryConstants.COOKIE_NAME
  )?.value;*/
  const userLikeHistory = "{}";

  return (
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient
        {...props}
        pageId={pageId}
        isLiked={userLikeHistory && JSON.parse(userLikeHistory)?.[pageId]}
        count={544}
      />
    </div>
  );
}
