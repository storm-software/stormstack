import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import { Suspense } from "react";
import LikeButton from "../(components)/LikeButtonServer";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import Client from "./client";

export const PAGE_ID = "home";
export const revalidate = 0;

export default async function Page() {
  return (
    <>
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />

      <Suspense fallback="Loading...">
        {/* @ts-expect-error Server Component */}
        <LikeButton contentId={PAGE_ID} />
      </Suspense>
    </>
  );
}
