import { render } from "@testing-library/react";

import { SubscriptionModalForm } from "./SubscriptionModalForm";

describe("SubscriptionModalForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SubscriptionModalForm />);
    expect(baseElement).toBeTruthy();
  });
});
