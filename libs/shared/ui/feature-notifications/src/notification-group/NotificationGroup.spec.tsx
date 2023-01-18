import { render } from "@testing-library/react";

import { NotificationGroup } from "./NotificationGroup";

describe("NotificationGroup", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<NotificationGroup />);
    expect(baseElement).toBeTruthy();
  });
});
