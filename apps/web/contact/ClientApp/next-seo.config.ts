import type {
  LogoJsonLdProps,
  NextSeoProps,
  SocialProfileJsonLdProps,
} from "next-seo";

export const NEXT_SEO_DEFAULT: NextSeoProps = {
  title: "Contact Page",
  titleTemplate: "Patrick Sullivan Development | %s",
  defaultTitle: "Patrick Sullivan Development",
  description:
    "A web application by New York based software developer Patrick Sullivan with the purpose of highlighting the usage of modern frameworks.",
  noindex: false,
  nofollow: false,
  canonical: "https://www.sullivanpj.com/contact",
  themeColor: "#2b2347",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://www.sullivanpj.com/contact",
    title: "Patrick Sullivan Development | Contact Page",
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
