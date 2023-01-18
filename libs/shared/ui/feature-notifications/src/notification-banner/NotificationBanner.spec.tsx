import { render } from "@testing-library/react";
import { NotificationTypes } from "../types";
import { NotificationBanner } from "./NotificationBanner";

describe("NotificationBanner", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <NotificationBanner
        type={NotificationTypes.ERROR}
        message="Test notification message"
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
