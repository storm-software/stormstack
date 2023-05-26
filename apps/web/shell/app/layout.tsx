import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { Link } from "@open-system/shared-ui-components/link";
import { Footer } from "@open-system/shared-ui-feature-layout/footer";
import { NavigationMenu } from "@open-system/shared-ui-feature-layout/navigation-menu";
import { SocialMediaLinks } from "@open-system/shared-ui-feature-layout/social-media-links";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Logo from "../../../../assets/box-logo-white.svg";
import {
  antiqueOlive,
  anybody,
  inter,
  melody,
  permanentMarker,
  satoshi,
} from "../styles/fonts";
import "../styles/globals.css";
import ContactFooterForm from "./(components)/contact-footer-form";
import PdfResumeDownloadLink from "./(components)/pdf-resume-download-link.client";

// const Navigation = dynamic(() => import("./nav-header"));
const CookiePolicyBanner = dynamic(
  () => import("./(components)/cookie-policy-banner.client")
);

export const metadata = {
  colorScheme: "dark",
  themeColor: "#18181B",
  title: {
    template: "%s - Pat Sullivan Development",
    default: "Pat Sullivan Development",
  },
  authors: [{ name: "Pat Sullivan", url: "https://pat-sullivan.com" }],
  metadataBase: new URL("https://pat-sullivan.com"),
  description:
    "A web application by New York based software developer Pat Sullivan with the purpose of highlighting the usage of modern frameworks.",
  noindex: false,
  nofollow: false,
  canonical: "https://pat-sullivan.com",
  generator: "Pat Sullivan",
  applicationName: "Pat Sullivan Development",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Pat",
    "Patrick",
    "Sullivan",
    "Development",
    "software",
    "architect",
    "engineer",
    "programming",
    "coding",
  ],
  creator: "Pat Sullivan",
  publisher: "Pat Sullivan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://pat-sullivan.com",
    title: "Pat Sullivan Development | Home",
    description:
      "A web application by New York based software developer Pat Sullivan with the purpose of highlighting the usage of modern frameworks.",
    profile: {
      firstName: "Pat",
      lastName: "Sullivan",
      username: "sullivanpj",
      gender: "male",
    },
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
        width: 800,
        height: 600,
        alt: "Pat Sullivan Development",
        type: "image/jpeg",
        secureUrl:
          "https://avatars.githubusercontent.com/u/99053093?s=400&u=54c2f5ea10abfa4418158e4fe0671c32adb7d3f6&v=4",
      },
    ],
    siteName: "Pat Sullivan Development",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        melody.variable,
        inter.variable,
        anybody.variable,
        antiqueOlive.variable,
        permanentMarker.variable,
        satoshi.variable,
        "bg-bg-1 antialiased"
      )}>
      <head />
      <body className="relative h-fit min-h-screen">
        <nav className="fixed top-0 z-nav h-0 w-full overflow-visible">
          {/*<NotificationGroup />*/}

          <NavigationMenu
            items={[
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" },
              { label: "About", href: "/about" },
              { label: "Login", href: "/" },
            ]}
            footer={
              <div className="relative flex flex-row-reverse items-center justify-between gap-4">
                <SocialMediaLinks />
                <Link className="absolute -bottom-5 left-[42%] h-[9.5rem] w-[10rem]">
                  <Logo className="h-[9.5rem] w-[10rem]" />
                </Link>
              </div>
            }
          />
        </nav>

        <div id="root-portal" />

        <div className="h-fit w-full">{props.children}</div>

        <CookiePolicyBanner />

        <Footer
          top={
            <div className="flex flex-row gap-16">
              <ContactFooterForm />
              <div className="hidden flex-row items-center justify-center lg:flex">
                <Link className="h-[20rem] w-[28rem]">
                  <BoxLogo className="h-[20rem] w-[28rem]" />
                </Link>
              </div>
            </div>
          }
          bottom={
            <div className="flex flex-col items-center justify-center gap-16 lg:flex-row lg:items-start">
              <div className="flex flex-col gap-2">
                <h3 className="whitespace-nowrap font-label-4 text-4xl text-slate-200 underline">
                  Navigation
                </h3>
                <div className="flex flex-row gap-16">
                  <div className="flex flex-col gap-1">
                    <Link variant="secondary">Home</Link>
                    <Link variant="secondary">About</Link>
                    <Link variant="secondary">Contact</Link>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link variant="secondary">Projects</Link>
                    <Link variant="secondary">Privacy</Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="whitespace-nowrap font-label-4 text-4xl text-slate-200 underline">
                  Blog
                </h3>
                <Link variant="secondary">Articles</Link>
                <Link variant="secondary">Latest</Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="whitespace-nowrap font-label-4 text-4xl text-slate-200 underline">
                  Docs
                </h3>
                <Link variant="secondary">Open System</Link>
                <Link variant="secondary">Design System</Link>
                <Link variant="secondary">Storybook</Link>
              </div>
              <div className="flex h-full flex-col items-center">
                <PdfResumeDownloadLink />
              </div>
              <div className="flex flex-1 flex-col items-center justify-center sm:flex-row">
                <div className="flex w-fit flex-col gap-0.5">
                  <SocialMediaLinks />
                  <div className="flex flex-col text-center">
                    <label className="font-footer-name text-lg text-primary">
                      Patrick J. Sullivan
                    </label>
                    <label className="text-md font-footer-name text-primary">
                      New York Metropolitan Area
                    </label>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </body>
    </html>
  );
}
