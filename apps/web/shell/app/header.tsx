"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-layout";

export default function Header() {
  return (
    <nav className="fixed top-0 z-nav h-20 w-full">
      <NavigationMenu
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "About", href: "/about" },
          { label: "Login", href: "/" },
        ]}
      />
    </nav>
  );
}
