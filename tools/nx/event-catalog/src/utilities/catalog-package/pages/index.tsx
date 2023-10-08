/* This example requires Tailwind CSS v2.0+ */

import getConfig from "next/config";
import Link from "next/link";
import { useConfig } from "../hooks/EventCatalog";

export default function Home() {
  const {
    title,
    tagline,
    primaryCTA = { label: "Explore Events", href: "/events" },
    secondaryCTA
  } = useConfig();

  const { publicRuntimeConfig: { basePath = "" } = {} } = getConfig();
  const logoToLoad = { alt: "Open System Logo", src: `logo-large.svg` };

  return (
    <main className="bg-bg-primary  md:min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pb-24 sm:pt-8 lg:pb-48 lg:pt-8 text-center">
        <img
          src={`${basePath}/${logoToLoad.src}`}
          alt={logoToLoad.alt}
          style={{ width: "600px" }}
          className="mx-auto"
        />
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          {title}
        </h1>
        {tagline && (
          <p className="mt-2 text-lg font-medium text-secondary">{tagline}</p>
        )}
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              className="w-full rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:px-10 md:py-4 md:text-lg flex items-center justify-center"
              href={primaryCTA.href}>
              {primaryCTA.label}
            </Link>
          </div>
          {secondaryCTA && (
            <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
              {secondaryCTA.href.includes("http") && (
                <a
                  href={secondaryCTA.href}
                  target="_blank"
                  className="w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:px-10 md:py-4 md:text-lg flex items-center justify-center"
                  rel="noreferrer">
                  {secondaryCTA.label}
                </a>
              )}
              {!secondaryCTA.href.includes("http") && (
                <Link
                  className="w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:px-10 md:py-4 md:text-lg flex items-center justify-center"
                  rel="noreferrer"
                  href={secondaryCTA.href}>
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 space-x-5" />
      </div>
    </main>
  );
}
