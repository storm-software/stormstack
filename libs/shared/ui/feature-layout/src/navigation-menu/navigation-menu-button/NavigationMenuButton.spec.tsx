/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { NavigationMenuButton } from "./NavigationMenuButton";

describe("NavigationMenuButton", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuButton opened={false} onClick={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe("NavigationMenuButton - Opened", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuButton opened={true} onClick={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe("NavigationMenuButton - Un-opened", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuButton opened={false} onClick={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
