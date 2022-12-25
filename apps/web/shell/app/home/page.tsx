import { UserLikeHistoryConstants } from "@open-system/engagement-ui-feat-reaction/constants";
import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import { cookies } from "next/headers";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import LikeButton from "../like-button";
import Client from "./client";

export const PAGE_ID = "home";

export default function Page() {
  const count = 458;
  const userLikeHistory = cookies()?.get?.(
    UserLikeHistoryConstants.COOKIE_NAME
  )?.value;

  return (
    <div className="bg-gradient-to-b from-slate-600/20 via-gray-400/10 to-black">
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />

      <LikeButton
        pageId={PAGE_ID}
        count={count}
        isLiked={userLikeHistory && JSON.parse(userLikeHistory)?.[PAGE_ID]}
        className="fixed right-0 bottom-12 z-like"
      />
    </div>
  );
}
