/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FileUpload name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});
