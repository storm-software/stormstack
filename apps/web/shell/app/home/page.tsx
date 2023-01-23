import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
//import { Suspense } from "react";
//import LikeButton from "../(components)/like-button.server";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import Client from "./client";

export const PAGE_ID = "home";

export default function Page() {
  return (
    <>
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />

      {/*<Suspense>
        <LikeButton pageId={PAGE_ID} />
  </Suspense>*/}
    </>
  );
}
