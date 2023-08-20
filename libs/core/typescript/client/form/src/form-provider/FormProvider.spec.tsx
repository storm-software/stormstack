/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { FormProvider } from "./FormProvider";

describe("FormProvider", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FormProvider />);
    expect(baseElement).toBeTruthy();
  });
});
