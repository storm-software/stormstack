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

const GetLikeCount = async (contentId: string): Promise<number> => {
  try {
    const request = ReactionApiRequestFactory.getReactionsCount({
      contentId,
      type: "like",
    });
    const response = await fetchHttpHandler({
      baseUrl: "http://reaction.api/api/v1",
    })(request);
    const result = await ReactionApiResponseProcessor.getReactionsCount(
      response.data
    );
    console.log(result);

    return result?.data?.length ? result?.data?.[0].count : 0;
  } catch (error) {
    return 0;
  }
};

export default async function LikeButton({
  className,
  contentId,
  ...props
}: LikeButtonProps) {
  const count = await GetLikeCount(contentId);

  return (
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient {...props} contentId={contentId} count={count} />
    </div>
  );
}
