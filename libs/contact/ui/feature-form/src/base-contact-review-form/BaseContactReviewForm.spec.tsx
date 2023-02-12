import { render } from "@testing-library/react";

import { BaseContactReviewForm } from "./BaseContactReviewForm";

describe("BaseContactReviewForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BaseContactReviewForm title="Title" />);
    expect(baseElement).toBeTruthy();
  });
});
