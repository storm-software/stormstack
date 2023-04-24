import {
  Abril_Fatface,
  Anybody,
  Frank_Ruhl_Libre,
  Inter,
  Nothing_You_Could_Do,
  Permanent_Marker,
} from "@next/font/google";
import localFont from "@next/font/local";
import { BoxLogo } from "@open-system/shared-ui-components/box-logo";
import { Link } from "@open-system/shared-ui-components/link";
import { Footer } from "@open-system/shared-ui-feature-layout/footer";
import { SocialMediaLinks } from "@open-system/shared-ui-feature-layout/social-media-links";
import clsx from "clsx";
import dynamic from "next/dynamic";
import React from "react";
import "../styles/globals.css";
import ContactFooterForm from "./(components)/contact-footer-form";
import PdfResumeDownloadLink from "./(components)/pdf-resume-download-link.client";
import RootProvider from "./store-provider";

const melody = localFont({
  variable: "--font-melody",
  src: "../../../../assets/fonts/BLMelody-Bold.woff2",
});

const satoshi = localFont({
  variable: "--font-satoshi",
  src: "../../../../assets/fonts/Satoshi-Bold.otf",
});

const antiqueOlive = localFont({
  variable: "--font-antique-olive",
  src: "../../../../assets/fonts/Antique-Olive-Black.ttf",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  weight: "400",
  subsets: ["latin"],
});

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl-libre",
  weight: "700",
  subsets: ["latin"],
});

const rockSalt = Nothing_You_Could_Do({
  variable: "--font-rock-salt",
  weight: "400",
  subsets: ["latin"],
});

const NavHeader = dynamic(() => import("./nav-header"));
const CookiePolicyBanner = dynamic(
  () => import("./(components)/cookie-policy-banner.client")
);

export const metadata = {
  themeColor: '#18181B',
  title: {
    template: "%s | Pat Sullivan Development",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        melody.variable,
        inter.variable,
        anybody.variable,
        antiqueOlive.variable,
        frankRuhlLibre.variable,
        abrilFatface.variable,
        permanentMarker.variable,
        satoshi.variable,
        rockSalt.variable,
        "bg-bg-1 antialiased"
      )}>
      <head />
      <body className="relative h-fit min-h-screen">
        <RootProvider>
          <NavHeader />

          <div id="root-portal" />

          <div className="h-fit w-full">{children}</div>

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
        </RootProvider>
      </body>
    </html>
  );
}
