import { MessageTypes } from "@stormstack/core-data-access";
import { render } from "@testing-library/react";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <Toast type={MessageTypes.ERROR} details="Test notification message" />
    );
    expect(baseElement).toBeTruthy();
  });
});
