import { TemplateContext } from "@asyncapi/generator-react-sdk";
import {
  Consumer,
  getChannels,
  GetChannelsResultItem,
  Logger,
  Publisher,
  toPascalCase,
} from "../../utils";

export function IAmqpService({ asyncapi, params }: TemplateContext) {
  Logger.info("Rendering IAmqpService");
  Logger.info(asyncapi);

  if (!asyncapi.hasComponents()) {
    return null;
  }

  Logger.info(asyncapi.channels());

  const publishers: Publisher[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !!channel?.isPublish
  ) as Publisher[];
  const consumers: Consumer[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !channel?.isPublish
  ) as Consumer[];

  return (
    <>{`using System;
using ${params.namespace}.Models;

namespace ${params.namespace}.Services.Interfaces;

public interface IAmqpService : IDisposable
{
    ${publishers
      .map(
        publisher => `
    /// <summary>
    /// Operations from async api specification
    /// </summary>
    /// <param name="message">The message to be handled by this amqp operation</param>
    void ${toPascalCase(publisher.operationId)}(${
          publisher.messageType
        } message);

        `
      )
      .join("")}

      ${consumers
        .map(
          consumer => `
      /// <summary>
      /// Operations from async api specification
      /// </summary>
      /// <param name="message">The message to be handled by this amqp operation</param>
      void ${toPascalCase(consumer.operationId)}();

          `
        )
        .join("")}
}`}</>
  );
}
