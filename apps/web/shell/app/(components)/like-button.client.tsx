"use client";

import {
  LikeButton as LikeButtonInner,
  LikeButtonProps,
} from "@open-system/reaction-ui-feature-like/like-button";

export default function LikeButtonClient(props: LikeButtonProps) {
  return <LikeButtonInner {...props} />;
}
