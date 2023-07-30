import { TemplateContext } from "@asyncapi/generator-react-sdk";
import { pascalCase } from "change-case";
import {
  Consumer,
  getChannels,
  GetChannelsResultItem,
  Publisher,
} from "../../utils";

export function ChannelPool({ asyncapi, params }: TemplateContext) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const publishers: Publisher[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !!channel?.isPublish
  ) as Publisher[];
  const consumers: Consumer[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !channel?.isPublish
  ) as Consumer[];

  return (
    <>{`using System;
  using System.Collections.Generic;
  using ${params.namespace}.Services.Interfaces;
  using RabbitMQ.Client;

  namespace ${params.namespace}.Services;

  /// <summary>
  /// A channel pool for all channels defined in the async api specification
  /// </summary>
  public class ChannelPool : IChannelPool
  {
      private class Channel : IDisposable
      {
          /// <summary>
          /// The confirm mode for the channel
          /// </summary>
          public bool Confirm { get; init; }

          /// <summary>
          /// The prefetch count for the channel
          /// </summary>
          public ushort PrefetchCount { get; init; }

          /// <summary>
          /// The underlying amqp model/channel
          /// </summary>
          public IModel Model { get; init; }

          public void Dispose()
          {
              Model?.Close();
              Model?.Dispose();
          }
      }

      private readonly IConnection _connection;
      private readonly IDictionary<string, Channel> _channels = new Dictionary<string, Channel>();

      private ChannelPool(IConnection connection)
      {
          _connection = connection;

          // creating producer channels
          ${publishers
            .reduce((ret: string[], publisher: Publisher) => {
              publisher?.operationId &&
                ret.push(
                  `_channels.Add("${pascalCase(
                    publisher.operationId
                  )}", CreateChannel(connection)); `
                );

              return ret;
            }, [])
            .join(" ")}

          // creating consumer channels
          ${consumers
            .reduce((ret: string[], consumer: Consumer) => {
              consumer?.operationId &&
                ret.push(
                  `_channels.Add("${pascalCase(
                    consumer.operationId
                  )}", CreateChannel(connection, ${consumer.prefetchCount}, ${
                    consumer.confirm
                  })); `
                );

              return ret;
            }, [])
            .join(" ")}
      }

      public static IChannelPool Create(IConnection connection)
      {
          return new ChannelPool(connection);
      }

      public IModel GetChannel(string operationId)
      {
          // check for channel
          if (!_channels.TryGetValue(operationId, out var channel))
          {
              throw new KeyNotFoundException($"No channel found for {operationId}");
          }

          if (!channel.Model.IsClosed)
          {
              return channel.Model;
          }

          // recreate channel if it is closed
          _channels[operationId] = CreateChannel(
              _connection,
              channel.PrefetchCount, // prefetch from x-prefetch-count on channel binding
              channel.Confirm); // confirm from confirm on operation binding

          return _channels[operationId].Model;
      }

      private Channel CreateChannel(
          IConnection connection,
          ushort prefetchCount = 100,
          bool confirm = false)
      {
          var model = connection.CreateModel();

          if (confirm)
          {
              model.ConfirmSelect();
          }

          model.BasicQos(0, prefetchCount, false);

          return new Channel
          {
              PrefetchCount = prefetchCount,
              Confirm = confirm,
              Model = model
          };
      }

      public void Dispose()
      {
          foreach (var (_, channel) in _channels)
          {
              channel?.Dispose();
          }
      }
  }`}</>
  );
}
