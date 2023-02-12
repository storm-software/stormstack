import { render } from "@testing-library/react";

import { ContactBusinessReviewForm } from "./ContactBusinessReviewForm";

describe("ContactBusinessReviewForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactBusinessReviewForm />);
    expect(baseElement).toBeTruthy();
  });
});
