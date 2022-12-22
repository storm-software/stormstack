import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import LikeButton from "../like-button";
import Client from "./client";

export default function Page() {
  const count = 458;

  return (
    <div className="bg-gradient-to-b from-gray-300/0 via-gray-300/5 to-black">
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />

      <LikeButton
        pageId="home"
        count={count}
        className="fixed right-0 bottom-12"
      />
    </div>
  );
}
