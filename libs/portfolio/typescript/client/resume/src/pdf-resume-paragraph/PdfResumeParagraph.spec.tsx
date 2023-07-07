import { render } from "@testing-library/react";

import { PdfResumeParagraph } from "./PdfResumeParagraph";

describe("PdfResumeParagraph", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeParagraph />);
    expect(baseElement).toBeTruthy();
  });
});
