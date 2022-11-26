import {
  Abril_Fatface,
  Anybody,
  Inter,
  Permanent_Marker,
  Poppins,
} from "@next/font/google";
import localFont from "@next/font/local";
import clsx from "clsx";
import React from "react";
import "./globals.css";
import { Header } from "./header";

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

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["800", "400", "100"],
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
        poppins.variable,
        abrilFatface.variable,
        permanentMarker.variable,
        "bg-bg-1"
      )}>
      <head />
      <body className="relative h-fit min-h-screen antialiased">
        <Header />

        <div className="mb-8 h-fit w-full">{children}</div>
      </body>
    </html>
  );
}
