import { ServerEnvManager } from "@stormstack/core-server-utilities/server-env-manager";
import { EnvManager } from "@stormstack/core-shared-env/env-manager";
import { Injector } from "@stormstack/core-shared-injection/injector/injector";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console";
import { Logger } from "@stormstack/core-shared-logging/logger";

Injector.bindService<EnvManager>(EnvManager, ServerEnvManager);
Injector.bindService<Logger>(Logger, ConsoleLogger);
