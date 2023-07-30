import { TemplateContext } from "@asyncapi/generator-react-sdk";
import { Logger } from "../../utils";

export function IChannelPool({ asyncapi, params }: TemplateContext) {
  Logger.info("Rendering IChannelPool");
  Logger.info(asyncapi);
  Logger.info(asyncapi.hasComponents());

  if (!asyncapi.hasComponents()) {
    return null;
  }

  return (
    <>{`using System;
  using RabbitMQ.Client;

  namespace ${params.namespace}.Services.Interfaces;

  /// <summary>
  /// Channel pool holding all channels for a async api specification
  /// </summary>
  public interface IChannelPool : IDisposable
  {
      /// <summary>
      /// Get a channel for a operation
      /// </summary>
      /// <param name="operationId">The operation id specified in the async api specification</param>
      /// <returns>A channel</returns>
      IModel GetChannel(string operationId);
  }`}</>
  );
}
