import { PropsWithBase } from "@open-system/design-system-components";
import {
  AddReactionRequestTypeEnum,
  getReactionsCount,
} from "@open-system/reaction-ui-data-access";
import LikeButtonClient from "./like-button.client";

export type LikeButtonProps = PropsWithBase<{
  contentId: string;
}>;

/*const GetLikeCount = async (contentId: string): Promise<number> => {
  try {
    const request = ReactionApiRequestFactory.getReactionsCount({
      contentId,
      type: "like",
    });
    const response = await fetchHttpHandler({
      baseUrl: "http://localhost:5000/api/v1",
    })(request);
    ConsoleLogger.debug(JSON.stringify(response));
    const result = await ReactionApiResponseProcessor.getReactionsCount(
      response.data
    );

    return ;
  } catch (error) {
    return 0;
  }
};*/

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
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient
        {...props}
        contentId={contentId}
        count={response?.data?.length ? response?.data?.[0].count : 0}
      />
    </div>
  );
}
