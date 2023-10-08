import { NavigationMenu } from "@stormstack/common-client-components";
import { BoxLogo, Footer } from "@stormstack/common-client-components/server";
import { Link, SocialMediaLinks } from "@stormstack/core-client-components";
import {
  NotificationGroup,
  ToastGroup
} from "@stormstack/core-client-notifications";
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
  satoshi
} from "../styles/fonts";
import RootProvider from "./root-provider";

/*const CookiePolicyBanner = dynamic(
  () => import("./(components)/cookie-policy-banner.client")
);*/

const title = "Pat Sullivan Development";
const description = "Software designed for tomorrow's brands";
const image =
  "https://pub-e71cff0f90204755bc910518d63cacf8.r2.dev/circle-logo.png";

const contactJsonLd: WithContext<ContactPoint> = {
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  email: "support@stormcloud.dev",
  availableLanguage: "en",
  areaServed: "Worldwide",
  contactOption: "TollFree",
  contactType: "customer support"
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
    "Data base management system software, Development environment software, Operating system software, Project management software, and Web platform development software."
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
  description:
    "A financial technology developer based out of the New York metropolitan area.",
  contactPoint: contactJsonLd
};

export const metadata = {
  colorScheme: "dark",
  themeColor: "#18181B",
  title: {
    template: `%s - ${title}`,
    default: title,
    images: [image]
  },
  authors: [{ name: "Pat Sullivan", url: "https://patsullivan.org" }],
  metadataBase: new URL("https://patsullivan.org"),
  description: description,
  manifest: "https://patsullivan.org/manifest.json",
  noindex: false,
  nofollow: false,
  canonical: "https://patsullivan.org",
  generator: "Pat Sullivan",
  applicationName: title,
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
    "coding"
  ],
  creator: "Pat Sullivan",
  publisher: "Pat Sullivan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

export default function RootLayout(props: {
  children: ReactNode;
  rating: ReactNode;
  cookie: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="h-fit min-h-screen relative">
        <RootProvider>
          <nav className="top-0 h-0 w-full fixed z-nav overflow-visible">
            <ToastGroup />
            <NotificationGroup />

            <NavigationMenu
              items={[
                { label: "Home", href: "/" },
                { label: "Contact", href: "/contact" },
                { label: "About", href: "/about" },
                { label: "Login", href: "/" }
              ]}
              footer={
                <div className="gap-4 relative flex flex-row-reverse items-center justify-between">
                  <SocialMediaLinks />
                  <Link className="-bottom-5 absolute left-[42%] h-[9.5rem] w-[10rem]">
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

          <div className="h-fit w-full min-h-[60vh]">{props.children}</div>

          {props.rating}
          {props.cookie}

          <Analytics />
          <Footer
            top={
              <div className="gap-16 flex flex-row">
                <ContactFooterForm />
                <div className="lg:flex hidden flex-row items-center justify-center">
                  <Link className="h-[20rem] w-[28rem]">
                    <BoxLogo className="h-[20rem] w-[28rem]" />
                  </Link>
                </div>
              </div>
            }
            bottom={
              <div className="gap-16 lg:flex-row lg:items-start flex flex-col items-center justify-center">
                <div className="gap-2 flex flex-col">
                  <h3 className="text-primary text-4xl whitespace-nowrap font-label-4 underline">
                    Navigation
                  </h3>
                  <div className="gap-16 flex flex-row">
                    <div className="gap-1 flex flex-col">
                      <Link variant="secondary">Home</Link>
                      <Link variant="secondary">About</Link>
                      <Link variant="secondary">Contact</Link>
                    </div>
                    <div className="gap-1 flex flex-col">
                      <Link variant="secondary">Projects</Link>
                      <Link variant="secondary">Privacy</Link>
                    </div>
                  </div>
                </div>
                <div className="gap-1 flex flex-col">
                  <h3 className="text-primary text-4xl whitespace-nowrap font-label-4 underline">
                    Blog
                  </h3>
                  <Link variant="secondary">Articles</Link>
                  <Link variant="secondary">Latest</Link>
                </div>
                <div className="gap-1 flex flex-col">
                  <h3 className="text-primary text-4xl whitespace-nowrap font-label-4 underline">
                    Docs
                  </h3>
                  <Link variant="secondary">Open System</Link>
                  <Link variant="secondary">Design System</Link>
                  <Link variant="secondary">Storybook</Link>
                </div>
                <div className="h-full flex flex-col items-center">
                  {/*<PdfResumeDownloadLink />*/}
                </div>
                <div className="flex-1 sm:flex-row flex flex-col items-center justify-center">
                  <div className="w-fit gap-0.5 flex flex-col">
                    <SocialMediaLinks />
                    <div className="flex flex-col text-center">
                      <p className="text-primary text-lg font-footer-name">
                        Patrick J. Sullivan
                      </p>
                      <p className="text-md text-primary font-footer-name">
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
    </html>
  );
}
