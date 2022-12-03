import { render } from "@testing-library/react";

import { PageLoading } from "./PageLoading";

describe("PageLoading", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PageLoading />);
    expect(baseElement).toBeTruthy();
  });
});
