import { render } from "@testing-library/react";

import { PdfResumeItem } from "./PdfResumeItem";

describe("PdfResumeItem", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PdfResumeItem />);
    expect(baseElement).toBeTruthy();
  });
});
