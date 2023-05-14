"use client";

import { PropsWithBase } from "@open-system/design-system-components";
import { LikeButton as LikeButtonInner } from "@open-system/reaction-ui-feature-like/like-button";

type LikeButtonClientProps = PropsWithBase<{
  contentId: string;
  count: number;
}>;

export default function LikeButtonClient(props: LikeButtonClientProps) {
  return <LikeButtonInner {...props} />;
}
