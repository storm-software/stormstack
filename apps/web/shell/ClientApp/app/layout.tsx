import { Inter } from "@next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head />
      <body className="bg-gray-1100">
        <nav>
          <div className="flex flex-row gap-2">
            <Link
              href="/"
              className="rounded-lg bg-gray-900 text-primary hover:bg-gray-800">
              Home
            </Link>
            <Link
              href="/contact"
              className="rounded-lg bg-gray-900 text-primary hover:bg-gray-800">
              Contact
            </Link>
            <Link
              href="/about"
              className="rounded-lg bg-gray-900 text-primary hover:bg-gray-800">
              About
            </Link>

            <Link
              href="/api/auth/login"
              className="rounded-lg bg-gray-900 text-primary hover:bg-gray-800">
              Login
            </Link>
          </div>
        </nav>

        <div className="lg:pl-72">{children}</div>
      </body>
    </html>
  );
}
