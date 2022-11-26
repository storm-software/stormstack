import localFont from "@next/font/local";
import { LikeButton } from "@open-system/engagement-ui-feat-like";
import clsx from "clsx";
import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";
import Client from "./Client";

const melody = localFont({
  variable: "--font-melody",
  src: "../../../../../assets/fonts/BLMelody-Bold.woff2",
});

export default function Page() {
  return (
    <div className={clsx(melody.variable)}>
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <Client />

      <div className="fixed right-0 bottom-12">
        <LikeButton pageId="home" />
      </div>
    </div>
  );
}
