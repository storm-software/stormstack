import { render } from "@testing-library/react";

import { ContentRating } from "./ContentRating";

describe("ContentRating", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContentRating />);
    expect(baseElement).toBeTruthy();
  });
});
