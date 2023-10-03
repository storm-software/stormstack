import { EnvManager } from "@stormstack/core-shared-env";
import { Provider } from "@stormstack/core-shared-injection";
import { ClientBaseEnvManager } from "../base";
import { ClientPrivateEnvManagerOptions } from "../types";

@Provider(EnvManager)
export class ClientPrivateEnvManager extends ClientBaseEnvManager<ClientPrivateEnvManagerOptions> {
  constructor(options?: ClientPrivateEnvManagerOptions) {
    super({
      ...options,
      isServer: true,
      prefix: undefined
    } as ClientPrivateEnvManagerOptions);
  }
}
