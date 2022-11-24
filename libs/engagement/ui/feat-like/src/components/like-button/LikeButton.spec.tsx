import { render } from "@testing-library/react";

import { LikeButtonClient } from "./LikeButton.client";

describe("LikeButton", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LikeButtonClient count={3561} />);
    expect(baseElement).toBeTruthy();
  });
});
