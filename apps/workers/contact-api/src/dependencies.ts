import { InfisicalEnvManager } from "@open-system/core-server-infisical/infisical-env-manager";
import { EnvManager } from "@open-system/core-shared-env/env-manager";
import { bindService } from "@open-system/core-shared-injection/utilities/bind-service";
import { ConsoleLogger } from "@open-system/core-shared-logging/console";
import { Logger } from "@open-system/core-shared-logging/logger";

bindService<EnvManager>(EnvManager, InfisicalEnvManager);
bindService<Logger>(Logger, ConsoleLogger);
