"use client";

import { Link } from "@open-system/shared-ui-components/link";
import { NavigationMenu } from "@open-system/shared-ui-feature-layout/navigation-menu";
import { SocialMediaLinks } from "@open-system/shared-ui-feature-layout/social-media-links/SocialMediaLinks";
import Logo from "../../../../assets/box-logo-white.svg";
//import PdfResumeDownloadLink from "./(components)/pdf-resume-download-link.client";

export default function NavHeader() {
  return (
    <nav className="fixed top-0 z-nav h-0 w-full overflow-visible">
      {/*<NotificationGroup />*/}

      <NavigationMenu
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/about" },
          { label: "About", href: "/about" },
          { label: "Login", href: "/" },
        ]}
        footer={
          <div className="relative flex flex-row-reverse items-center justify-between gap-4">
            <SocialMediaLinks />
            <Link className="absolute -bottom-5 left-[42%] h-[9.5rem] w-[10rem]">
              <Logo className="h-[9.5rem] w-[10rem]" />
            </Link>
          </div>
        }
      />
    </nav>
  );
}
