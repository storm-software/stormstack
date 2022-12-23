"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import { LikeButton as LikeButtonInner } from "@open-system/engagement-ui-feat-like/like-button";

export type LikeButtonProps = PropsWithBase<{
  pageId: string;
  count: number;
  isLiked: boolean;
}>;

export default function LikeButton({
  className,
  isLiked = false,
  ...props
}: LikeButtonProps) {
  return (
    <div className={className}>
      <LikeButtonInner {...props} isLiked={isLiked} />
    </div>
  );
}
