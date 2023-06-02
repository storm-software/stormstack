import { render } from "@testing-library/react";

import { LogoLoading } from "./LogoLoading";

describe("LogoLoading", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LogoLoading />);
    expect(baseElement).toBeTruthy();
  });
});
