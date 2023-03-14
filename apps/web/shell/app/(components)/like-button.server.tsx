import { PropsWithBase } from "@open-system/design-system-components";
import {
  AddReactionRequestTypeEnum,
  getReactionsCount,
} from "@open-system/reaction-ui-data-access";
import LikeButtonClient from "./like-button.client";

export type LikeButtonProps = PropsWithBase<{
  contentId: string;
}>;

export default async function LikeButton({
  className,
  contentId,
  ...props
}: LikeButtonProps) {
  const { response } = await getReactionsCount({
    contentId,
    type: AddReactionRequestTypeEnum.LIKE as any,
  });

  return (
    <div className="fixed right-0 top-3/4 z-like">
      <LikeButtonClient
        {...props}
        contentId={contentId}
        count={response?.data?.length ? response?.data?.[0].count : 0}
      />
    </div>
  );
}
