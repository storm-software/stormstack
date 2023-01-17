import { FormatHelpers } from "@asyncapi/modelina";
import { AsyncAPIDocument, Channel, Message, Schema } from "@asyncapi/parser";
import _ from "lodash";
const contentTypeJSON = "application/json";
const contentTypeString = "text/plain";
const contentTypeBinary = "application/octet-stream";

export interface TemplateParameters {
  generateTestClient: boolean;
  promisifyReplyCallback: boolean;
}

export interface Publisher {
  isPublish: boolean;
  routingKey?: string;
  operationId?: string;
  expiration?: any;
  userId?: any;
  cc?: any;
  bcc?: any;
  priority?: any;
  deliveryMode?: any;
  mandatory?: any;
  replyTo?: any;
  timestamp?: boolean;
  ack?: boolean;
  exchange?: any;
  exchangeType?: string;
  isDurable?: boolean;
  isAutoDelete?: boolean;
  alternateExchange?: string;
  messageType?: string;
}

export interface Consumer {
  isPublish: boolean;
  routingKey: string;
  operationId: string;
  operationDescription: string;
  queue: string;
  prefetchCount: number;
  confirm: any;
  exchange: string;
  exchangeType: string;
  messageType: string;
}

export type GetChannelsResultItem = Publisher | Consumer | null;

export type GetChannelsResult = GetChannelsResultItem[];

/**
 * Should the callbacks be promisify.
 *
 * @param {TemplateParameters} params passed to the template
 * @returns {boolean} should it promisify callbacks
 */
export function shouldPromisifyCallbacks(params: any) {
  return params.promisifyReplyCallback;
}

export function toCamelCase(str: string) {
  return _.camelCase(str);
}

export function toPascalCase(str: string) {
  str = _.camelCase(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toKebabCase(str: string) {
  return _.kebabCase(str);
}

/**
 * Returns the schema file name
 *
 * @param {string} schemaName
 * @returns
 */
export function getSchemaFileName(schemaName: string) {
  return FormatHelpers.toPascalCase(schemaName);
}

/**
 * Figure out if our message content type or default content type matches a given payload.
 *
 * @param {string} messageContentType to check against payload
 * @param {string} defaultContentType to check against payload
 * @param {string} payload to check
 */
function containsPayload(
  messageContentType: string,
  defaultContentType: string,
  payload: string
) {
  if (
    (messageContentType !== undefined &&
      messageContentType.toLowerCase() === payload) ||
    (defaultContentType !== undefined && defaultContentType === payload)
  ) {
    return true;
  }
  return false;
}

export function isBinaryPayload(
  messageContentType: string,
  defaultContentType: string
) {
  return containsPayload(
    messageContentType,
    defaultContentType,
    contentTypeBinary
  );
}

export function isStringPayload(
  messageContentType: string,
  defaultContentType: string
) {
  return containsPayload(
    messageContentType,
    defaultContentType,
    contentTypeString
  );
}

export function isJsonPayload(
  messageContentType: string,
  defaultContentType: string
) {
  return containsPayload(
    messageContentType,
    defaultContentType,
    contentTypeJSON
  );
}

/**
 * Checks if the message payload is of type null
 *
 * @param {Schema} messagePayload to check
 * @returns {boolean} does the payload contain null type
 */
export function messageHasNotNullPayload(messagePayload: Schema) {
  return `${messagePayload.type()}` !== "null";
}

/**
 * Get message type ensure that the correct message type is returned.
 *
 * @param {Message} message to find the message type for
 */
export function getMessageType(message: Message) {
  if (`${message.payload().type()}` === "null") {
    return "null";
  }
  return `${getSchemaFileName(message.payload().uid())}`;
}

/**
 * Convert JSON schema draft 7 types to typescript types
 * @param {*} jsonSchemaType
 * @param {*} property
 */
export function toCType(jsonSchemaType: string, property?: any) {
  switch (jsonSchemaType.toLowerCase()) {
    case "string":
      return "String";
    case "integer":
      return "int";
    case "number":
      return "decimal";
    case "boolean":
      return "bool";
    case "object":
      if (property) {
        return `${property.uid()}Schema`;
      }
      return "object";

    default:
      return "object";
  }
}

/**
 * Cast JSON schema variable to csharp type
 *
 * @param {*} jsonSchemaType
 * @param {*} variableToCast
 */
export function castToCType(jsonSchemaType: string, variableToCast: string) {
  switch (jsonSchemaType.toLowerCase()) {
    case "string":
      return `$"{${variableToCast}}"`;
    case "integer":
      return `int.Parse(${variableToCast})`;
    case "number":
      return `decimal.Parse(${variableToCast}, System.Globalization.CultureInfo.InvariantCulture)`;
    case "boolean":
      return `bool.Parse(${variableToCast})`;
    default:
      throw new Error(`Parameter type not supported - ${jsonSchemaType}`);
  }
}

/**
 * Realize parameters without using types without trailing comma
 */
export function realizeParametersForChannelWithoutType(parameters: any) {
  let returnString = "";
  for (const [paramName] of parameters) {
    returnString += `${paramName},`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}

/**
 * Realize parameters using types without trailing comma
 */
export function realizeParametersForChannel(parameters: any, required = true) {
  let returnString = "";
  const requiredType = !required ? "?" : "";
  for (const parameter of parseParameters(parameters)) {
    returnString += `${parameter.csharpType}${requiredType} ${parameter.name} ${parameter.example},`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}

export function parseParameters(parameters: any) {
  const params = [];
  for (const [paramName, parameter] of Object.entries(parameters)) {
    params.push({
      csharpType: toCType((parameter as any).schema().type()),
      name: paramName,
      example: (parameter as any).extension("x-example"),
    });
  }
  return params;
}

export function cleanString(str: string) {
  return str.replace(/ {2}|\r\n|\n|\r/gm, "").trim();
}

export function getChannels(asyncapi: AsyncAPIDocument): GetChannelsResult {
  const channels = asyncapi.channels();
  if (!channels?.length) {
    Logger.error("No channels were found in MQ spec.");

    return [];
  }

  Logger.info(`Found ${channels.length} channels.`);
  Logger.info(channels);

  return Object.entries(channels)
    .map(([channelName, channel]: [string, Channel]) => {
      if (channel.hasPublish() && channel.hasBinding("amqp")) {
        const operation = channel.publish();
        const channelBinding = channel.binding("amqp");
        const operationBinding = operation.binding("amqp");

        // this should generate a consumer
        return {
          isPublish: true,
          routingKey: channelName,
          operationId: operation.id(),
          expiration: operationBinding["expiration"],
          userId: operationBinding["userId"],
          cc: operationBinding["cc"],
          bcc: operationBinding["bcc"],
          priority: operationBinding["priority"],
          deliveryMode: operationBinding["deliveryMode"],
          mandatory: operationBinding["mandatory"],
          replyTo: operationBinding["replyTo"],
          timestamp: operationBinding["timestamp"],
          ack: operationBinding["ack"],
          exchange: channelBinding.exchange.name,
          exchangeType: channelBinding.exchange.type,
          isDurable: channelBinding.exchange.durable,
          isAutoDelete: channelBinding.exchange.autoDelete,
          alternateExchange: channelBinding.exchange["x-alternate-exchange"],
          messageType: toPascalCase(operation.message.name), // TODO: handle multiple messages on a operation
        };
      }

      if (channel.hasSubscribe() && channel.hasBinding("amqp")) {
        const operation = channel.subscribe();
        const channelBinding = channel.binding("amqp");

        // this should generate a publisher
        return {
          isPublish: false,
          routingKey: channelName,
          operationId: operation.id(),
          operationDescription: operation.description(),
          queue: channelBinding.queue.name,
          prefetchCount: channelBinding.queue["x-prefetch-count"],
          confirm: channelBinding.queue["x-confirm"],
          exchange: channelBinding.exchange.name,
          exchangeType: channelBinding.exchange.type,
          messageType: toPascalCase(operation.message.name), // TODO: handle multiple messages on a operation
        };
      }

      return null;
    })
    .filter(publisher => publisher);
}

export function getPublishers(asyncapi: AsyncAPIDocument) {
  const channels = asyncapi.channels();
  return Object.entries(channels)
    .map(([channelName, channel]: [string, Channel]) => {
      if (channel.hasPublish() && channel.hasBinding("amqp")) {
        const operation = channel.publish();
        const binding = channel.binding("amqp");

        const publisher = {
          routingKey: channelName,
          operationId: operation.id(),
          operationDescription: operation.description(),
          queue: binding.queue.name,
          prefetchCount: binding.exchange["x-prefetch-count"],
          exchange: binding.exchange.name,
          alternateExchange: binding.exchange["x-alternate-exchange"],
          messageType: toPascalCase(operation.message.name), // TODO: handle multiple messages on a operation
        };

        console.log();

        return publisher;
      }

      return null;
    })
    .filter(publisher => publisher);
}

export const addBasicProperty = () => {
  return "test";
};

export let Logger = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info: (params: any) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error: (params: any) => {},
};

function init() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const utils = require("../../../../libs/core/typescript/utilities");

  if (utils) {
    utils.ConsoleLogger && (Logger = utils.ConsoleLogger);
  }
}

init();
