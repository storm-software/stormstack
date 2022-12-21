import { render } from "@testing-library/react";

import { Link } from "./Modal";

describe("Link", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Link href="/path">Item Label</Link>);
    expect(baseElement).toBeTruthy();
  });
});
