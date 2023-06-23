import { render } from "@testing-library/react";

import { PdfResumeDownloadLink } from "./PdfResumeDownloadLink";

describe("PdfResumeDownloadLink", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeDownloadLink />);
    expect(baseElement).toBeTruthy();
  });
});
