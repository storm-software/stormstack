import { fetchHttpHandler } from "@open-system/core-typescript-utilities";
import { PropsWithBase } from "@open-system/design-system-components";
import {
  ReactionApiRequestFactory,
  ReactionApiResponseProcessor,
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
  const request = ReactionApiRequestFactory.getReactionsCount({
    contentId,
    type: "like",
  });
  const response = await fetchHttpHandler({
    baseUrl: "http://localhost:5000/api/v1",
  })(request);
  const result = await ReactionApiResponseProcessor.getReactionsCount(
    response.data
  );
  console.log(result);

  return (
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient
        {...props}
        contentId={contentId}
        count={result?.data?.length ? result?.data?.[0].count : 0}
      />
    </div>
  );
}
