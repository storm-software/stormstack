"use client";

import LikeButtonClientQueryNode, {
  LikeButtonClientQuery,
} from "@open-system/data-catalog-graphql/__generated__/LikeButtonClientQuery.graphql";
import { PropsWithBase } from "@open-system/design-system-components";
import { getCurrentEnvironment } from "../../relay/environment";
import { SerializablePreloadedQuery } from "../../relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "../../relay/useSerializablePreloadedQuery";
import LikeButtonClient from "./LikeButtonClient";

export type LikeButtonProps = PropsWithBase<{
  contentId: string;
  preloadedQuery: SerializablePreloadedQuery<
    typeof LikeButtonClientQueryNode,
    LikeButtonClientQuery
  >;
}>;

export default async function LikeButton({
  className,
  preloadedQuery,
  ...props
}: LikeButtonProps) {
  const environment = getCurrentEnvironment();
  const queryRef = useSerializablePreloadedQuery(environment, preloadedQuery);

  return (
    <div className="fixed right-0 top-3/4 z-like">
      <LikeButtonClient {...props} queryRef={queryRef} />
    </div>
  );
}
