import { render } from "@testing-library/react";
import { MessageTypes } from "@open-system/core-data-access";
import { AlertBanner } from "./AlertBanner";

describe("AlertBanner", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <AlertBanner
        type={MessageTypes.ERROR}
        details="Test notification message"
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
