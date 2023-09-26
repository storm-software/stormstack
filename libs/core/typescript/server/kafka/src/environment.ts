import {
  NumberFromString,
  emptyString
} from "@stormstack/core-shared-utilities";
import * as zod from "zod";

export const KafkaConfigModel = zod.object({
  KAFKA_BOOTSTRAP_ENDPOINT: zod.string().url(),
  KAFKA_USERNAME: zod.string(),
  KAFKA_PASSWORD: zod.string(),
  KAFKA_TIMEOUT: emptyString(NumberFromString.optional())
});

export type KafkaConfig = zod.infer<typeof KafkaConfigModel>;
