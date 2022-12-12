"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-layout/navigation-menu";

export default function NavHeader() {
  return (
    <nav className="fixed top-0 z-nav h-20 w-full">
      <NavigationMenu
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/about" },
          { label: "About", href: "/about" },
          { label: "Login", href: "/" },
        ]}
      />
    </nav>
  );
}
