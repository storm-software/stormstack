import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../next-seo.config";

export default function Page() {
  return (
    <div className="space-y-8">
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <h1 className="text-xl font-medium text-gray-300">Examples</h1>

      <div className="space-y-10 text-white"></div>
    </div>
  );
}
