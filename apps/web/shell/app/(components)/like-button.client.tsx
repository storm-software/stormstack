"use client";

import {
  LikeButton as LikeButtonInner,
  LikeButtonProps,
} from "@open-system/reaction-ui-feature-like/like-button";
import PersistGate from "./persist-gate";

export default function LikeButtonClient(props: LikeButtonProps) {
  return (
    <PersistGate>
      <LikeButtonInner {...props} />
    </PersistGate>
  );
}
