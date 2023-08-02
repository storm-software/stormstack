import {
  EventPublisher,
  EventStore,
  IAggregateRoot,
  IDomainEvent,
  MessageBroker,
} from "@open-system/core-server-services";
import { Logger } from "@open-system/core-shared-utilities";
import { Injectable } from "graphql-modules";
import { CompressionTypes, Message } from "kafkajs";
import { KafkaConfig } from "../environment";
import {
  KafkaMessageBrokerReadConfig,
  KafkaMessageBrokerWriteConfig,
} from "../types";

@Injectable()
export class KafkaEventPublisher extends EventPublisher {
  #config: KafkaConfig;

  constructor(
    logger: Logger,
    broker: MessageBroker<
      Message,
      KafkaMessageBrokerReadConfig,
      KafkaMessageBrokerWriteConfig
    >,
    eventStore: EventStore,
    config: KafkaConfig
  ) {
    super(logger, broker, eventStore);

    this.#config = config;
  }

  protected override innerPublishEvent = async <
    TAggregate extends IAggregateRoot = IAggregateRoot
  >(
    event: IDomainEvent<TAggregate>
  ): Promise<void> => {
    event.aggregateId;
    const message = {
      key: `${event.aggregateId}-v${event.aggregateSequence}`,
      headers: {
        eventType: event.eventType,
        eventVersion: String(event.integrationEvent.version),
        timestamp: event.timestamp.toISOString(),
        correlationId: event.correlationId,
        aggregateId: event.aggregateId,
        aggregateSequence: String(event.aggregateSequence),
        aggregateType: event.aggregateType,
      },
      value: event.integrationEvent.stringify(),
      timestamp: event.timestamp.toISOString(),
    };

    await this.broker.write<Message>(
      event.integrationEvent.eventType,
      message,
      {
        compression: CompressionTypes.GZIP,
        timeout: this.#config.KAFKA_TIMEOUT ?? 100000,
      }
    );
  };
}
