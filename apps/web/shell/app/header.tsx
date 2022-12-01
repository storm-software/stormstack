"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-navigation";

export function Header() {
  return (
    <nav className="fixed top-0 z-nav h-20 w-full">
      <NavigationMenu
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
          { name: "About", href: "/about" },
          { name: "Login", href: "/" },
        ]}
      />
    </nav>
  );
}
