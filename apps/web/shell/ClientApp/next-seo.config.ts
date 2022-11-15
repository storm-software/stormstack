import type {
  ArticleJsonLdProps,
  LogoJsonLdProps,
  NextSeoProps,
  SocialProfileJsonLdProps,
} from "next-seo";

export const NEXT_SEO_DEFAULT: NextSeoProps = {
  title: "Landing Page",
  titleTemplate: "Patrick Sullivan Development | %s",
  defaultTitle: "Patrick Sullivan Development",
  description:
    "A web application by New York based software developer Patrick Sullivan with the purpose of highlighting the usage of modern frameworks.",
  noindex: false,
  nofollow: false,
  canonical: "https://www.sullivanpj.com/",
  themeColor: "#2b2347",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://www.sullivanpj.com/",
    title: "Patrick Sullivan Development | Landing Page",
    description:
      "A web application by New York based software developer Patrick Sullivan with the purpose of highlighting the usage of modern frameworks.",
    profile: {
      firstName: "Patrick",
      lastName: "Sullivan",
      username: "sullivanpj",
      gender: "male",
    },
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
        width: 800,
        height: 600,
        alt: "Patrick Sullivan Development",
        type: "image/jpeg",
        secureUrl:
          "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
      },
    ],
    siteName: "Patrick Sullivan Development",
  },
  twitter: {
    handle: "@handlea",
    site: "@sitea",
    cardType: "summary_large_image",
  },
};

export const ARTICLE_JSON_LD_DEFAULT: ArticleJsonLdProps = {
  url: "https://www.sullivanpj.com/",
  title: "Patrick Sullivan Development",
  images: [],
  datePublished: "2022-11-15T08:00:00+08:00",
  dateModified: "2022-11-15T09:00:00+08:00",
  authorName: [
    {
      name: "Patrick Sullivan",
      url: "https://github.com/sullivanpj",
    },
  ],
  publisherName: "Patrick Sullivan",
  publisherLogo:
    "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
  description:
    "A web application by New York based software developer Patrick Sullivan with the purpose of highlighting the usage of modern frameworks.",
  isAccessibleForFree: true,
};

export const PROFILE_JSON_LD_DEFAULT: SocialProfileJsonLdProps = {
  type: "Person",
  name: "Patrick Sullivan",
  url: "https://www.sullivanpj.com/",
  sameAs: ["https://github.com/sullivanpj"],
};

export const LOGO_JSON_LD_DEFAULT: LogoJsonLdProps = {
  logo: "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
  url: "https://www.sullivanpj.com/",
};
