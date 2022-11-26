import {
  Abril_Fatface,
  Anybody,
  Inter,
  Permanent_Marker,
  Poppins,
} from "@next/font/google";
import clsx from "clsx";
import React from "react";
import "./globals.css";
import { Header } from "./header";

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

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
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
        inter.variable,
        anybody.variable,
        poppins.variable,
        abrilFatface.variable,
        permanentMarker.variable,
        "bg-gray-300"
      )}>
      <head />
      <body className="relative h-fit bg-gradient-to-b from-bg-1 via-bg-1/95 to-bg-1/0 antialiased">
        <Header />

        <div className="mb-8 h-fit w-full">{children}</div>
      </body>
    </html>
  );
}