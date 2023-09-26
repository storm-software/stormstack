import { Logger } from "@stormstack/core-shared-logging/logger";
import { BaseUtilityClass } from "@stormstack/core-shared-utilities/common";
import { MESSAGE_BROKER_TOKEN } from "../types";

export abstract class MessageBroker<
  TBaseMessage = unknown,
  TReadConfig = unknown,
  TWriteConfig = unknown
> extends BaseUtilityClass {
  constructor(protected readonly logger: Logger) {
    super(MESSAGE_BROKER_TOKEN);
  }

  public async subscribe<TMessage extends TBaseMessage>(
    channel: string | string[] | RegExp,
    handler: (channel: string, message: TMessage) => Promise<void>,
    config?: TReadConfig
  ): Promise<void> {
    this.logger.debug(`Reading message from channel ${channel}`);

    await this.innerSubscribe<TMessage>(channel, handler, config);
  }

  public async write<TMessage extends TBaseMessage>(
    channel: string,
    message: TMessage,
    config?: TWriteConfig
  ): Promise<void> {
    this.logger.debug(
      `Writing message to channel ${channel}: ${JSON.stringify(message)}`
    );

    await this.innerWrite<TMessage>(channel, message, config);
  }

  protected abstract innerSubscribe: <TMessage extends TBaseMessage>(
    channel: string | string[] | RegExp,
    handler: (channel: string, message: TMessage) => Promise<void>,
    config?: TReadConfig
  ) => Promise<void>;

  protected abstract innerWrite: <TMessage extends TBaseMessage>(
    channel: string,
    message: TMessage,
    config?: TWriteConfig
  ) => Promise<void>;
}
