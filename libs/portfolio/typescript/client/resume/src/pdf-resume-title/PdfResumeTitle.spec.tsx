import { render } from "@testing-library/react";

import { PdfResumeTitle } from "./PdfResumeTitle";

describe("PdfResumeTitle", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeTitle />);
    expect(baseElement).toBeTruthy();
  });
});
