"use client";

import {
  parseBoolean,
  stringifyBoolean,
} from "@open-system/core-typescript-utilities";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useCallback, useEffect, useState } from "react";

export const useIsLiked = (
  pageId: string,
  initCount = 0
): [boolean, () => void, number] => {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initCount);

  useEffect(() => {
    setIsLiked(!!parseBoolean(parseCookies()?.[`${pageId}_liked`]));
  }, [pageId]);

  return [
    isLiked,
    useCallback(() => {
      if (isLiked) {
        destroyCookie(null, `${pageId}_liked`);
        setIsLiked(false);
        setCount(count - 1);
      } else {
        setCookie(null, `${pageId}_liked`, stringifyBoolean(true));
        setIsLiked(true);
        setCount(count + 1);
      }
    }, [count, isLiked, pageId]),
    count,
  ];
};
