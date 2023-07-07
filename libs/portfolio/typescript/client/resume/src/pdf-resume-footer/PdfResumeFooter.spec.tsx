import { render } from "@testing-library/react";

import { PdfResumeFooter } from "./PdfResumeFooter";

describe("PdfResumeFooter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeFooter />);
    expect(baseElement).toBeTruthy();
  });
});
