import { render } from "@testing-library/react";

import { SuccessContactForm } from "./SuccessContactForm";

describe("SuccessContactForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <SuccessContactForm title="Title" note="Note" />
    );
    expect(baseElement).toBeTruthy();
  });
});
