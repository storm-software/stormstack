"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-layout";

export default function NavHeader() {
  return (
    <nav className="z-nav fixed top-0 h-20 w-full">
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
