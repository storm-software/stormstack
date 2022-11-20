import { Barrio, Inter } from "@next/font/google";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
});

const barrio = Barrio({
  variable: "--font-barrio",
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(inter.variable, barrio.variable, "bg-slate-800")}>
      <head />
      <body className="relative h-fit bg-gradient-to-b from-bg-1 via-bg-1/80 to-bg-1/0">
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex flex-row gap-2 px-4 py-4">
            <Link href="/home" className="text-primary">
              Home
            </Link>
            <Link href="/contact" className="text-primary">
              Contact
            </Link>
            <Link href="/about" className="text-primary">
              About
            </Link>

            <Link href="/home" className="text-primary">
              Login
            </Link>
          </div>
        </nav>

        <div className="my-10 h-fit w-full">{children}</div>
      </body>
    </html>
  );
}
