import React from "react";
import { toPascalCase } from "../utils";

export function Consumers({ channels }) {
  if (channels.length === 0) {
    return null;
  }

  return (
    <>{`protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
          _amqpService.${toPascalCase(channels[0].operationId)}();
          return Task.CompletedTask;
        }`}</>
  );
}
