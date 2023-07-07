import { render } from "@testing-library/react";

import { BaseContactForm } from "./BaseContactForm";

describe("BaseContactForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <BaseContactForm title="Title" description="Description" />
    );
    expect(baseElement).toBeTruthy();
  });
});
