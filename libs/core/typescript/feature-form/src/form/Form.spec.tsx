/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from "@testing-library/react";

import { Form } from "./Form";

describe("Form", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <Form
        onSubmit={(value: any) => {
          return new Promise(() => {});
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
