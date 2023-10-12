import { EnvManager } from "@stormstack/core-shared-env";
import { Provider } from "@stormstack/core-shared-injection";
import { parseInteger } from "@stormstack/core-shared-utilities";
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

  public get queryCacheExpireMs(): number {
    return parseInteger(
      this.getWithDefault("QUERY_CACHE_EXPIRE_MS", 1000 * 60 * 60 * 24)
    );
  }
}
