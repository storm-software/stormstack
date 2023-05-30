import { render } from "@testing-library/react";

import { UrlInput } from "./UrlInput";

describe("UrlInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<UrlInput name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});
