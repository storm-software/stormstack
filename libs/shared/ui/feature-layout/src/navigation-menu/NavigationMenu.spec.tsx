import { render } from "@testing-library/react";

import { NavigationMenu } from "./NavigationMenu";

describe("NavigationMenu", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenu
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "About", href: "/about" },
          { label: "Login", href: "/login" },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe("NavigationMenu - No Items", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<NavigationMenu items={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
