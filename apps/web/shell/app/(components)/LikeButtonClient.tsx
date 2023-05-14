"use client";

import { LikeButtonClientQuery } from "@open-system/data-catalog-graphql/__generated__/LikeButtonClientQuery.graphql";
import { PropsWithBase } from "@open-system/design-system-components";
import { LikeButton as LikeButtonInner } from "@open-system/reaction-ui-feature-like/like-button";
import { PreloadedQuery, graphql, usePreloadedQuery } from "react-relay";

type LikeButtonClientProps = PropsWithBase<{
  contentId: string;
  count: number;
}>;

export default function LikeButtonClient(props: LikeButtonClientProps) {
 
  return (
    <LikeButtonInner {...props} />
  );
}
