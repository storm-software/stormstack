import { ClientPublicEnvManager } from "@stormstack/core-client-env";
import { ConsoleLogger } from "@stormstack/core-shared-logging";
import { isFunction } from "@stormstack/core-shared-utilities/common/type-checks";
import { ApiClient } from "./api-client";

describe("ApiClient", () => {
  it("should render successfully", () => {
    const apiClient = new ApiClient(
      new ConsoleLogger(),
      new ClientPublicEnvManager()
    );

    expect(isFunction(apiClient.query)).toBeTruthy();
  });
});
