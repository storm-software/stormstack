import { ClientPublicEnvManager } from "@stormstack/core-client-env";
import { isDevelopment } from "@stormstack/core-shared-utilities";
import { atom } from "jotai";

export const envAtom = atom(new ClientPublicEnvManager());
if (isDevelopment()) {
  envAtom.debugPrivate = true;
}
