import {
  EventPublisher,
  EventStore,
  MessageBroker
} from "@open-system/core-server-application";
import { IAggregateRoot, IDomainEvent } from "@open-system/core-server-domain";
import { Service } from "@open-system/core-shared-injection";
import { JsonParser } from "@open-system/core-shared-serialization/json-parser";
import { Logger } from "@open-system/core-shared-utilities";
import { CompressionTypes, Message } from "kafkajs";
import { KafkaConfig } from "../environment";
import {
  KafkaMessageBrokerReadConfig,
  KafkaMessageBrokerWriteConfig
} from "../types";

@Service()
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
    const message = {
      key: `${event.aggregateId}-v${event.aggregateSequence}`,
      headers: {
        timestamp: event.timestamp.toISOString(),
        correlationId: event.correlationId,
        aggregateId: event.aggregateId,
        aggregateSequence: String(event.aggregateSequence),
        aggregateType: event.aggregateType
      },
      value: JsonParser.stringify(event.integrationEvent),
      timestamp: event.timestamp.toISOString()
    };

    await this.broker.write<Message>(
      event.integrationEvent.eventType,
      message,
      {
        compression: CompressionTypes.GZIP,
        timeout: this.#config.KAFKA_TIMEOUT ?? 100000
      }
    );
  };
}
