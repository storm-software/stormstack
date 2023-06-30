import { Link, SocialMediaLinks } from "@open-system/core-components";
import {
  NotificationGroup,
  ToastGroup,
} from "@open-system/core-feature-notifications";
import { NavigationMenu } from "@open-system/shared-components";
import { BoxLogo, Footer } from "@open-system/shared-components/server";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { ContactPoint, Occupation, Person, WithContext } from "schema-dts";
import { ContactFooterForm } from "../components/contact-footer-form";
import "../styles/entry.css";
import {
  antiqueOlive,
  inter,
  melody,
  monaSans,
  monaSansExtraBold,
  permanentMarker,
  robotoMono,
  satoshi,
} from "../styles/fonts";
import RootProvider from "./root-provider";

/*const CookiePolicyBanner = dynamic(
  () => import("./(components)/cookie-policy-banner.client")
);*/

const contactJsonLd: WithContext<ContactPoint> = {
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  email: "contact@patsullivan.org",
  availableLanguage: "en",
  areaServed: "Worldwide",
  contactOption: "TollFree",
  contactType: "customer support",
};

const architectJsonLd: WithContext<Occupation> = {
  "@context": "https://schema.org",
  "@type": "Occupation",
  estimatedSalary: 150000,
  experienceRequirements: "Minimum of 5+ years in a related field",
  educationRequirements:
    "Minimum of four-year bachelor's degree in Computer Science",
  occupationalCategory: "15-1299.08",
  qualifications:
    "A considerable amount of work-related skill, knowledge, or experience is needed.",
  responsibilities:
    "Design and develop solutions to complex applications problems, system administration issues, or network concerns. Perform systems management and integration functions.",
  skills:
    "Data base management system software, Development environment software, Operating system software, Project management software, and Web platform development software.",
};

const personJsonLd: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pat Sullivan",
  givenName: "Pat",
  familyName: "Sullivan",
  email: "pat@patsullivan.org",
  url: "https://patsullivan.org",
  hasOccupation: architectJsonLd,
  jobTitle: "Software Architect",
  knowsLanguage: "en",
  description: "Software designed for tomorrow's brands",
  contactPoint: contactJsonLd,
};

export const metadata = {
  colorScheme: "dark",
  themeColor: "#18181B",
  title: {
    template: "%s - Pat Sullivan Development",
    default: "Pat Sullivan Development",
  },
  authors: [{ name: "Pat Sullivan", url: "https://patsullivan.org" }],
  metadataBase: new URL("https://patsullivan.org"),
  description: "Software designed for tomorrow's brands",
  manifest: "https://patsullivan.org/manifest.json",
  noindex: false,
  nofollow: false,
  canonical: "https://patsullivan.org",
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
};

export default function RootLayout(props: {
  children: ReactNode;
  rating: ReactNode;
  cookie: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        melody.variable,
        inter.variable,
        robotoMono.variable,
        monaSans.variable,
        monaSansExtraBold.variable,
        antiqueOlive.variable,
        permanentMarker.variable,
        satoshi.variable,
        "bg-bg-primary antialiased"
      )}>
      <head />
      <body className="relative h-fit min-h-screen">
        <RootProvider>
          <nav className="fixed top-0 z-nav h-0 w-full overflow-visible">
            <ToastGroup />
            <NotificationGroup />

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
                    <BoxLogo
                      className="h-[9.5rem] w-[10rem]"
                      colorScheme="light"
                    />
                  </Link>
                </div>
              }
            />
          </nav>

          <div id="root-portal" />

          <div className="h-fit min-h-[60vh] w-full">{props.children}</div>

          {props.rating}
          {props.cookie}

          <Analytics />
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
                  <h3 className="whitespace-nowrap font-label-4 text-4xl text-primary underline">
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
                  <h3 className="whitespace-nowrap font-label-4 text-4xl text-primary underline">
                    Blog
                  </h3>
                  <Link variant="secondary">Articles</Link>
                  <Link variant="secondary">Latest</Link>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="whitespace-nowrap font-label-4 text-4xl text-primary underline">
                    Docs
                  </h3>
                  <Link variant="secondary">Open System</Link>
                  <Link variant="secondary">Design System</Link>
                  <Link variant="secondary">Storybook</Link>
                </div>
                <div className="flex h-full flex-col items-center">
                  {/*<PdfResumeDownloadLink />*/}
                </div>
                <div className="flex flex-1 flex-col items-center justify-center sm:flex-row">
                  <div className="flex w-fit flex-col gap-0.5">
                    <SocialMediaLinks />
                    <div className="flex flex-col text-center">
                      <p className="font-footer-name text-lg text-primary">
                        Patrick J. Sullivan
                      </p>
                      <p className="text-md font-footer-name text-primary">
                        New York Metropolitan Area
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </RootProvider>
      </body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </html>
  );
}
