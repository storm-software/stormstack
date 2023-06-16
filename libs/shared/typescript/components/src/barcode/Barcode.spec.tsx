import { render } from "@testing-library/react";

import Barcode from "./Barcode";

describe("Barcode", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Barcode />);
    expect(baseElement).toBeTruthy();
  });
});
