import { render } from "@testing-library/react";

import { ToastGroup } from "./ToastGroup";

describe("ToastGroup", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ToastGroup />);
    expect(baseElement).toBeTruthy();
  });
});
