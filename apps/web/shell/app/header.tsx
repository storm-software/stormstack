"use client";

import { NavigationMenu } from "@open-system/shared-ui-feat-navigation";

export function Header() {
  return (
    <nav className="fixed top-0 h-20 w-full">
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
