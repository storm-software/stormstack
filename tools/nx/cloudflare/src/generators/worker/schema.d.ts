import { Schema } from "@nx/node/src/generators/application/schema";

export interface CloudflareWorkerGeneratorSchema extends Schema {
  zoneId?: string;
  accountId?: string;
  route?: string;
  workersDev?: boolean;
  nodeCompat?: boolean;
}
