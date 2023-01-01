"use client";

import { AbstractReactionsApi } from "@open-system/engagement-ui-data-access";
import { useInjection } from "inversify-react";
import { parseCookies, setCookie } from "nookies";
import { useCallback, useState } from "react";
import { UserLikeHistoryConstants } from "./constants";
import { UserLikeHistory } from "./types";

export function useIsLiked(
  pageId: string,
  initIsLiked = false
): [boolean, () => void] {
  const [isLiked, setIsLiked] = useState(initIsLiked);
  const api = useInjection(AbstractReactionsApi);

  return [
    isLiked,
    useCallback(async () => {
      const cookie: UserLikeHistory = parseCookies()?.[
        UserLikeHistoryConstants.COOKIE_NAME
      ]
        ? JSON.parse(parseCookies()?.[UserLikeHistoryConstants.COOKIE_NAME])
        : {};
      console.log(cookie);

      await api.addArticleReaction({
        id: pageId,
        type: "like",
        userId: "PSUL",
      });

      cookie[pageId] = !cookie[pageId];
      setIsLiked(cookie[pageId]);

      setCookie(
        null,
        UserLikeHistoryConstants.COOKIE_NAME,
        JSON.stringify(cookie)
      );
    }, [api, pageId]),
  ];
}
