import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../next-seo.config";

export default function Page() {
  return (
    <div className="bg-gradient-to-t from-gray-300/0 via-gray-300/5 to-gray-300/0">
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />
    </div>
  );
}
