import { EnvManager } from "@stormstack/core-shared-env";
import { Provider } from "@stormstack/core-shared-injection";
import { ClientBaseEnvManager } from "../base";
import { ClientPublicEnvManagerOptions } from "../types";

@Provider(EnvManager)
export class ClientPublicEnvManager extends ClientBaseEnvManager<ClientPublicEnvManagerOptions> {
  constructor(options?: ClientPublicEnvManagerOptions) {
    super({
      ...options,
      isServer: false,
      prefix: "NEXT_PUBLIC_"
    } as ClientPublicEnvManagerOptions);
  }
}
