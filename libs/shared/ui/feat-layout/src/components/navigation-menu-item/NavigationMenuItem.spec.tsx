import { render } from "@testing-library/react";

import { NavigationMenuItem } from "./NavigationMenuItem";

describe("NavigationMenuItem", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuItem href="/path" label="Item Label" />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe("NavigationMenuItem - Selected", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuItem selected={true} href="/path" label="Item Label" />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe("NavigationMenuItem - Un-selected", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NavigationMenuItem selected={false} href="/path" label="Item Label" />
    );
    expect(baseElement).toBeTruthy();
  });
});
