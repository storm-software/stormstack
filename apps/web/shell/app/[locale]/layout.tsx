import {
  Abril_Fatface,
  Anybody,
  Frank_Ruhl_Libre,
  Inter,
  Permanent_Marker,
} from "@next/font/google";
import localFont from "@next/font/local";
import { Footer } from "@open-system/shared-ui-feat-layout/footer";
import clsx from "clsx";
import React from "react";
import "reflect-metadata";
import "../../dependency-inversion.config";
import "../../styles/globals.css";
import NavHeader from "../nav-header";
import RootLayout from "../layout";

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
      <body className="relative h-fit min-h-screen bg-gradient-to-tl from-black via-white/30 to-white/5 antialiased">
        <div className="bg-gradient-to-t from-black via-black/20">
          <NavHeader />

          <div id="root-portal" />

          <div className="h-fit w-full">
            <RootProvider>{children}</RootProvider>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
