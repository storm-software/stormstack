import { render } from "@testing-library/react";

import { PdfResume } from "./PdfResume";

describe("PdfResume", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResume />);
    expect(baseElement).toBeTruthy();
  });
});
