import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import Client from "./Client";

export default function Page() {
  return (
    <div className="h-full w-full">
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />
    </div>
  );
}
