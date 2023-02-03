import { render } from "@testing-library/react";

import { PdfResumeSection } from "./PdfResumeSection";

describe("PdfResumeSection", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeSection title="Test" />);
    expect(baseElement).toBeTruthy();
  });
});
