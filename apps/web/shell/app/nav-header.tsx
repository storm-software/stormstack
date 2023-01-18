"use client";

import { NavigationMenu } from "@open-system/shared-ui-feature-layout/navigation-menu";
import { NotificationGroup } from "@open-system/shared-ui-feature-notifications/notification-group";

export default function NavHeader() {
  return (
    <nav className="fixed top-0 z-nav h-0 w-full overflow-visible">
      <NotificationGroup />

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
