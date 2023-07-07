/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { SubscriptionCheckbox } from "./SubscriptionCheckbox";

describe("SubscriptionCheckbox", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SubscriptionCheckbox name="Test" />);
    expect(baseElement).toBeTruthy();
  });
});
