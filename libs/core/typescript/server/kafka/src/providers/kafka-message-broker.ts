import { MessageBroker } from "@open-system/core-server-application";
import { Provider } from "@open-system/core-shared-injection";
import { Logger, UniqueIdGenerator } from "@open-system/core-shared-utilities";
import { Consumer, Kafka, Message, Producer } from "kafkajs";
import { KafkaConfig } from "../environment";
import {
  KafkaMessageBrokerReadConfig,
  KafkaMessageBrokerWriteConfig
} from "../types";

@Provider()
export class KafkaMessageBroker extends MessageBroker<
  Message,
  KafkaMessageBrokerReadConfig,
  KafkaMessageBrokerWriteConfig
> {
  #kafka: Kafka;
  #producer: Producer;
  #consumer: Consumer;
  #groupId: string;

  constructor(logger: Logger, config: KafkaConfig) {
    super(logger);

    this.#kafka = new Kafka({
      brokers: [config.KAFKA_BOOTSTRAP_ENDPOINT],
      sasl: {
        mechanism: "scram-sha-512",
        username: config.KAFKA_USERNAME,
        password: config.KAFKA_PASSWORD
      },
      ssl: true
    });

    this.#groupId = UniqueIdGenerator.generate();
    this.#producer = this.#kafka.producer();
    this.#consumer = this.#kafka.consumer({
      groupId: this.#groupId
    });
  }

  protected override innerWrite = async <TMessage extends Message>(
    channel: string,
    message: TMessage,
    config?: KafkaMessageBrokerWriteConfig
  ): Promise<void> => {
    this.logger.debug(`Writing data to topic: ${channel}`);

    await this.#producer.connect();
    await this.#producer.send({
      ...config,
      topic: channel,
      messages: [message]
    });
    await this.#producer.disconnect();
  };

  protected override innerSubscribe = async <TMessage>(
    channel: string | string[] | RegExp,
    handler: (channel: string, message: TMessage) => Promise<void>,
    config?: KafkaMessageBrokerReadConfig
  ): Promise<void> => {
    await this.#consumer.connect();

    await this.#consumer.subscribe({
      topics: Array.isArray(channel) ? channel : [channel],
      fromBeginning: true,
      ...config?.subscription
    });

    await this.#consumer.run({
      autoCommit: true,
      ...config?.handler,
      eachMessage: async ({ topic, message }) => {
        this.logger.debug(`Reading data from topic: ${topic}`);

        handler(topic, message as TMessage);
      }
    });
  };
}
