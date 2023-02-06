import {
  Abril_Fatface,
  Anybody,
  Frank_Ruhl_Libre,
  Inter,
  Permanent_Marker,
} from "@next/font/google";
import localFont from "@next/font/local";
// import { ContactFooterForm } from "@open-system/contact-ui-feature-form/contact-footer-form";
import { Link } from "@open-system/shared-ui-components/link";
import { Footer } from "@open-system/shared-ui-feature-layout/footer";
import { SocialMediaLinks } from "@open-system/shared-ui-feature-layout/social-media-links";
import clsx from "clsx";
import { LinkVariants } from "design-system/components/src/link";
import React from "react";
import "reflect-metadata";
import Logo from "../../../../assets/box-logo-gradient.svg";
import "../dependency-inversion.config";
import "../styles/globals.css";
import ContactFooterForm from "./(components)/contact-footer-form";
import CookiePolicyBanner from "./(components)/cookie-policy-banner.server";
import PdfResumeDownloadLink from "./(components)/pdf-resume-download-link.client";
import NavHeader from "./nav-header";
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
});

const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  weight: "400",
});

const anybody = Anybody({
  variable: "--font-anybody",
});

const inter = Inter({
  variable: "--font-inter",
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl-libre",
  weight: "700",
});

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
                    <Logo className="h-[20rem] w-[28rem]" />
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
                      <Link variant={LinkVariants.SECONDARY}>Home</Link>
                      <Link variant={LinkVariants.SECONDARY}>About</Link>
                      <Link variant={LinkVariants.SECONDARY}>Contact</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link variant={LinkVariants.SECONDARY}>Projects</Link>
                      <Link variant={LinkVariants.SECONDARY}>Privacy</Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="whitespace-nowrap font-label-4 text-4xl text-slate-200 underline">
                    Blog
                  </h3>
                  <Link variant={LinkVariants.SECONDARY}>Articles</Link>
                  <Link variant={LinkVariants.SECONDARY}>Latest</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="whitespace-nowrap font-label-4 text-4xl text-slate-200 underline">
                    Docs
                  </h3>
                  <Link variant={LinkVariants.SECONDARY}>Open System</Link>
                  <Link variant={LinkVariants.SECONDARY}>Design System</Link>
                  <Link variant={LinkVariants.SECONDARY}>Storybook</Link>
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
