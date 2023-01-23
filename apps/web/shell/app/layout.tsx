import {
  Abril_Fatface,
  Anybody,
  Frank_Ruhl_Libre,
  Inter,
  Permanent_Marker,
} from "@next/font/google";
import localFont from "@next/font/local";
import { Footer } from "@open-system/shared-ui-feature-layout/footer";
import clsx from "clsx";
import React from "react";
import "reflect-metadata";
import "../dependency-inversion.config";
import "../styles/globals.css";
import CookiePolicyBanner from "./(components)/cookie-policy-banner.server";
import NavHeader from "./nav-header";
import RootProvider from "./store-provider";

const melody = localFont({
  variable: "--font-melody",
  src: "../../../../assets/fonts/BLMelody-Bold.woff2",
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
        frankRuhlLibre.variable,
        abrilFatface.variable,
        permanentMarker.variable,
        "bg-gradient-to-b from-bg-1 via-black to-black"
      )}>
      <head />
      <body className="relative h-fit min-h-screen bg-gradient-to-tl from-black via-bg-1 to-bg-1/80 antialiased">
        <div className="bg-gradient-to-t from-black via-black/20">
          <NavHeader />

          <div id="root-portal" />

          <div className="h-fit w-full">
            <RootProvider>{children}</RootProvider>
          </div>

          <CookiePolicyBanner />

          <Footer />
        </div>
      </body>
    </html>
  );
}
