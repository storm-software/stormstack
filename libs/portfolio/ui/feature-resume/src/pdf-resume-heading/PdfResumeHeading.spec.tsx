import { render } from "@testing-library/react";

import { PdfResumeHeading } from "./PdfResumeHeading";

describe("PdfResumeHeading", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeHeading />);
    expect(baseElement).toBeTruthy();
  });
});
