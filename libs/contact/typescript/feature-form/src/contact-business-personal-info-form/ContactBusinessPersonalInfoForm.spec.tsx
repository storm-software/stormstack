import { render } from "@testing-library/react";

import { ContactBusinessPersonalInfoForm } from "./ContactBusinessPersonalInfoForm";

describe("ContactBusinessPersonalInfoForm", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactBusinessPersonalInfoForm />);
    expect(baseElement).toBeTruthy();
  });
});
