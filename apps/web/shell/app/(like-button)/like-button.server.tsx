import { INVERSION_CONTAINER } from "@open-system/core-typescript-utilities";
import { PropsWithBase } from "@open-system/design-system-components";
import { AbstractReactionApi } from "@open-system/engagement-ui-data-access";
import { UserLikeHistoryConstants } from "@open-system/engagement-ui-feat-reaction/constants";
import { cookies } from "next/headers";
import LikeButtonClient from "./like-button.client";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
}>;

export default async function LikeButton({
  className,
  pageId,
  ...props
}: LikeButtonProps) {
  const api = INVERSION_CONTAINER.get(AbstractReactionApi);

  const resp = await api.getReactions({ id: pageId });
  console.log(resp);
  const userLikeHistory = cookies()?.get?.(
    UserLikeHistoryConstants.COOKIE_NAME
  )?.value;

  return (
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient
        {...props}
        pageId={pageId}
        isLiked={userLikeHistory && JSON.parse(userLikeHistory)?.[pageId]}
        count={0}
      />
    </div>
  );
}
