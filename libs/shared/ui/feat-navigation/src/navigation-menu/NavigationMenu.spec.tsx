import { render } from "@testing-library/react";

import { NavigationMenu } from "./NavigationMenu";

describe("NavigationMenu", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenu
        items={[
          { name: "Home", href: "/home" },
          { name: "Contact", href: "/contact" },
          { name: "About", href: "/about" },
          { name: "Login", href: "/login" },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
