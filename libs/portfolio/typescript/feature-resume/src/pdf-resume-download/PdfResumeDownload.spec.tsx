import { render } from "@testing-library/react";

import { PdfResumeDownload } from "./PdfResumeDownload";

describe("PdfResumeDownload", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeDownload />);
    expect(baseElement).toBeTruthy();
  });
});
