"use client";

import { LikeButtonClientQuery } from "@open-system/data-catalog-graphql/__generated__/LikeButtonClientQuery.graphql";
import { PropsWithBase } from "@open-system/design-system-components";
import { LikeButton as LikeButtonInner } from "@open-system/reaction-ui-feature-like/like-button";
import { PreloadedQuery, graphql, usePreloadedQuery } from "react-relay";

type LikeButtonClientProps = PropsWithBase<{
  contentId: string;
  queryRef: PreloadedQuery<LikeButtonClientQuery>;
}>;

export default function LikeButtonClient(props: LikeButtonClientProps) {
  const data = usePreloadedQuery(
    graphql`
      query LikeButtonClientQuery($ID: String!) {
        REACTIONS(ID: $ID) {
          ID
          TYPE
          COUNT
        }
      }
    `,
    props.queryRef
  );

  return <LikeButtonInner {...props} count={data?.REACTIONS?.COUNT ?? 0} />;
}
