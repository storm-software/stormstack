// import { ConfigurationError } from "@stormstack/core-shared-utilities";
import Path from "path";

const templateMapping = {
  "kafka-typescript": "kafka",
  "rabbitmq-dotnet": "rabbitmq"
};

export const mapTemplateToImport = (template: string) => {
  if (!template || !templateMapping[template.toLowerCase()]) {
    throw new Error(`Template ${template} not found`);
  }

  return Path.join(
    "dist",
    "tools",
    "async-api",
    templateMapping[template.toLowerCase()]
  );
};
