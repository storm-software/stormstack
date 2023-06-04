import { render } from "@testing-library/react";

import { AlertGroup } from "./AlertGroup";

describe("AlertGroup", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AlertGroup />);
    expect(baseElement).toBeTruthy();
  });
});
