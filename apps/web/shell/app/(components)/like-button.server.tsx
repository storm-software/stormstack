import {
  ConsoleLogger,
  ResponseContext,
} from "@open-system/core-typescript-utilities";
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
  /*const api = INVERSION_CONTAINER.get(AbstractReactionsApi);

  const resp = await api.getArticleReaction({
    id: pageId,
    type: "like",
    userId: "PSUL",
  });
  console.log(resp);
  const userLikeHistory = cookies()?.get?.(
    UserLikeHistoryConstants.COOKIE_NAME
  )?.value;
  const fetcher = fetchHttpHandler({ baseUrl: "http://localhost:5000/api/v1" });
  const response = await fetcher(
    ReactionApiRequestFactory.getReactionsCount({
      contentId,
      type: "like",
    })
  );

  const request = ReactionApiRequestFactory.getReactionsCount({
    contentId,
    type: "like",
  });*/

  /*const response = await fetch("http://localhost:5000/api/v1", {
    method: "POST",
    body: {
      contentId,
      type: "like",
    } as any,
  });
  // const json = await response.json();
  const data = await ReactionApiResponseProcessor.getReactionsCount(
    ResponseContext.create(
      response.status,
      {},
      {
        text: () => response.text(),
        binary: () => response.blob(),
      },
      response.statusText
    )
  );*/

  const request = ReactionApiRequestFactory.getReactionsCount({
    contentId,
    type: "like",
  });
  const response = await fetch(
    request.getUrl("http://localhost:5000/api/v1"),
    request.getRequestOptions()
  );
  const result = await ReactionApiResponseProcessor.getReactionsCount(
    ResponseContext.create(
      response.status,
      {},
      {
        text: () => response.text(),
        binary: () => response.blob(),
      },
      response.statusText
    )
  );
  ConsoleLogger.debug(JSON.stringify(result));

  return (
    <div className="fixed right-0 bottom-12 z-like">
      <LikeButtonClient
        {...props}
        contentId={contentId}
        count={result?.data?.length ?? 0}
      />
    </div>
  );
}
