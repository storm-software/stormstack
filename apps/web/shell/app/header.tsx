"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-navigation";

export function Header() {
  return (
    <nav className="sticky top-0 z-50 h-20 w-full">
      <NavigationMenu
        items={[
          { name: "Home", href: "/home" },
          { name: "Contact", href: "/contact" },
          { name: "About", href: "/about" },
          { name: "Login", href: "/home" },
        ]}
      />
    </nav>
  );
}
