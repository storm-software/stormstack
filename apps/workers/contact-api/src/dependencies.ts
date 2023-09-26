import { ServerEnvManager } from "@stormstack/core-server-utilities/server-env-manager";
import { EnvManager } from "@stormstack/core-shared-env/env-manager";
import { bindService } from "@stormstack/core-shared-injection/utilities/bind-service";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { Logger } from "@stormstack/core-shared-logging/logger";

bindService<EnvManager>(EnvManager, ServerEnvManager);
bindService<Logger>(Logger, ConsoleLogger);
