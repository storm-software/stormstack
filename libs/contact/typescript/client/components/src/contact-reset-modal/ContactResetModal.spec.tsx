import { render } from "@testing-library/react";

import { ContactResetModal } from "./ContactResetModal";

describe("ContactResetModal", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ContactResetModal />);
    expect(baseElement).toBeTruthy();
  });
});
