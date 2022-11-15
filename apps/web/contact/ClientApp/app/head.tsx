import { NextSeo } from "next-seo";
import { NEXT_SEO_DEFAULT } from "../next-seo.config";

export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <NextSeo {...NEXT_SEO_DEFAULT} useAppDir={true} />
    </>
  );
}
