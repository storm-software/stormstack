import { render } from "@testing-library/react";

import { ContactFormStepReview } from "./ContactFormStepReview";

describe("ContactFormStepReview", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <ContactFormStepReview name="name" label="label" />
    );
    expect(baseElement).toBeTruthy();
  });
});
