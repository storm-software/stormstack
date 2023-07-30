import { pascalCase } from "change-case";
import { Consumer } from "../utils";

export function Consumers({ consumers }: { consumers: Consumer[] }) {
  if (consumers.length === 0) {
    return null;
  }

  return (
    <>{`protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
          _amqpService.${pascalCase(consumers[0].operationId)}();
          return Task.CompletedTask;
        }`}</>
  );
}
