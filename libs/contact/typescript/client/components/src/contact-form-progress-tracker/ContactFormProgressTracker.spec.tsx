import { render } from "@testing-library/react";

import { ContactFormProgressTracker } from "./ContactFormProgressTracker";

describe("ContactFormProgressTracker", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactFormProgressTracker />);
    expect(baseElement).toBeTruthy();
  });
});
