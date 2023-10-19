/* eslint-disable @typescript-eslint/no-explicit-any */

import { sha3_512 } from "@noble/hashes/sha3";
import { crypto } from "./crypto";
import { randomLetter } from "./random";

/**
 * Resolvable value types for a valid Snowflake.
 * * string
 * * number
 * * bigint
 * @type {SnowflakeResolvable}
 */

type SnowflakeResolvable = string;

/**
 * Interface of a Snowflake after `Generator.deconstruct()`.
 * @property {bigint} snowflake - Snowflake deconstructed from
 * @property {bigint} timestamp - The timestamp the snowflake was generated
 * @property {bigint} shard_id - The shard_id used when generating
 * @property {bigint} increment - The increment of this snowflake
 * @property {string} binary - The 64Bit snowflake binary string
 * @interface DeconstructedSnowflake
 */

interface DeconstructedSnowflake {
  timestamp: number;
  shard_id: number;
  sequence: number;
  binary: string;
}

export type GenerateParams = {
  timestamp?: Date | number;
  shardId?: number;
};

export interface IUniqueIdGenerator {
  generate: (params?: GenerateParams) => string;
}

export class UniqueIdGenerator {
  /**
   * The generators epoch timestamp in milliseconds.
   *
   * Defaults to "1st of January, 2000, 00:00".
   *
   * @type {number}
   */
  public static EPOCH: number = Date.UTC(1970, 0, 1).valueOf();

  /**
   * The id of the shard running this generator.
   *
   * Defaults to "1".
   *
   * @type {number}
   */
  public static SHARD_ID = 1;

  /**
   * ~22k hosts before 50% chance of initial counter collision with a remaining counter range of 9.0e+15 in JavaScript.
   */
  private static readonly INITIAL_COUNT_MAX = 476782367;

  /**
   * The length of the CUID fingerprint.
   */
  private static readonly CUID_LARGE_LENGTH = 36;

  /**
   * The sequence of the current running generator.
   *
   * @default 1
   */
  private static _sequence = 1;

  /**
   * The counter used to help prevent collisions.
   */
  private static _counter =
    Math.floor(Math.random() * UniqueIdGenerator.INITIAL_COUNT_MAX) +
    UniqueIdGenerator._sequence;

  /**
   * Generates a single snowflake.
   *
   * @param {Date|number} [timestamp = Date.now] - Timestamp to generate from
   * @returns {bigint}
   */
  public static snowflake({
    timestamp = Date.now(),
    shardId = UniqueIdGenerator.SHARD_ID
  }: GenerateParams = {}): string {
    if (timestamp instanceof Date) timestamp = timestamp.valueOf();
    else timestamp = new Date(timestamp).valueOf();

    // tslint:disable:no-bitwise
    let result =
      (BigInt(timestamp) - BigInt(UniqueIdGenerator.EPOCH)) << BigInt(22);
    result = result | (BigInt(shardId % 1024) << BigInt(12));
    result = result | BigInt(UniqueIdGenerator._sequence++ % 4096);
    // tslint:enable:no-bitwise
    return result.toString();
  }

  /**
   * Generate a UUID v4 compliant string
   * @returns {string} - UUID v4 string
   */
  public static uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Generate a CUID compliant string
   * @returns {string} - CUID string
   */
  public static cuid(): string {
    // If we're lucky, the `.toString(36)` calls may reduce hashing rounds
    // by shortening the input to the hash function a little.
    const time = Date.now().toString(UniqueIdGenerator.CUID_LARGE_LENGTH);
    const count = UniqueIdGenerator._counter.toString(
      UniqueIdGenerator.CUID_LARGE_LENGTH
    );

    // The salt should be long enough to be globally unique across the full
    // length of the hash. For simplicity, we use the same length as the
    // intended id output.
    const salt = UniqueIdGenerator.createEntropy(length, Math.random);

    return `${
      randomLetter() +
      UniqueIdGenerator.hash(
        `${time + salt + count + UniqueIdGenerator.fingerprint()}`
      ).substring(1, length)
    }`;
  }

  /**
   * This is a fingerprint of the host environment. It is used to help prevent collisions when generating ids in a distributed system.
   *
   * @remarks If no global object is available, you can pass in your own, or fall back on a random string.
   *
   * @param options - Options
   * @returns {string} - The environment's Fingerprint
   */
  public static fingerprint = (
    options: {
      globalObj?: any;
    } = {
      globalObj:
        typeof global !== "undefined"
          ? global
          : typeof window !== "undefined"
          ? window
          : {}
    }
  ) => {
    const globals = Object.keys(options.globalObj).toString();
    const sourceString = globals.length
      ? globals +
        UniqueIdGenerator.createEntropy(
          UniqueIdGenerator.CUID_LARGE_LENGTH,
          Math.random
        )
      : UniqueIdGenerator.createEntropy(
          UniqueIdGenerator.CUID_LARGE_LENGTH,
          Math.random
        );

    return UniqueIdGenerator.hash(sourceString).substring(
      0,
      UniqueIdGenerator.CUID_LARGE_LENGTH
    );
  };

  /**
   * Create a hash from a string.
   * @param input - String to hash
   * @returns {string} - Hashed string
   */
  public static hash(input = ""): string {
    // Drop the first character because it will bias the histogram
    // to the left.
    return UniqueIdGenerator.bufToBigInt(sha3_512(input))
      .toString(UniqueIdGenerator.CUID_LARGE_LENGTH)
      .slice(1);
  }

  /**
   * Deconstruct a snowflake to its values using the `Generator.epoch`.
   * @param {SnowflakeResolvable|SnowflakeResolvable[]} snowflake - Snowflake(s) to deconstruct
   * @returns {DeconstructedSnowflake|DeconstructedSnowflake[]}
   */
  public static parse(snowflake: SnowflakeResolvable): DeconstructedSnowflake {
    const binary = UniqueIdGenerator.binary(snowflake);
    return {
      timestamp: UniqueIdGenerator.extractBits(snowflake, 1, 41),
      shard_id: UniqueIdGenerator.extractBits(snowflake, 42, 10),
      sequence: UniqueIdGenerator.extractBits(snowflake, 52),
      binary
    };
  }

  /**
   * Check if a snowflake string Id is valid.
   *
   * @param snowflake - Snowflake to check
   * @returns {boolean} - Whether the snowflake is valid
   */
  public static isValidSnowflake(snowflake: string) {
    if (!/^[\d]{19}$/.test(snowflake)) {
      return false;
    }
    try {
      UniqueIdGenerator.parse(snowflake);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Extract bits and their values from a snowflake.
   * @param {SnowflakeResolvable} snowflake - Snowflake to extract from
   * @param {number|bigint} shift - Number of bits to shift before extracting
   * @param {number|bigint} length - Number of bits to extract before stopping
   * @returns {bigint}
   */
  public static extractBits(
    snowflake: SnowflakeResolvable,
    start: number,
    length?: number
  ): number {
    return parseInt(
      length
        ? UniqueIdGenerator.binary(snowflake).substring(start, start + length)
        : UniqueIdGenerator.binary(snowflake).substring(start),
      2
    );
  }

  /**
   * Transform a snowflake into its 64Bit binary string.
   * @param {SnowflakeResolvable} snowflake - Snowflake to transform
   * @returns {string}
   * @private
   */
  public static binary(snowflake: SnowflakeResolvable): string {
    const cached64BitZeros =
      "0000000000000000000000000000000000000000000000000000000000000000";
    const binValue = BigInt(snowflake).toString(2);
    return binValue.length < 64
      ? cached64BitZeros.substring(0, 64 - binValue.length) + binValue
      : binValue;
  }

  private static createEntropy = (length = 4, random = Math.random) => {
    let entropy = "";

    while (entropy.length < length) {
      entropy =
        entropy +
        Math.floor(random() * UniqueIdGenerator.CUID_LARGE_LENGTH).toString(
          UniqueIdGenerator.CUID_LARGE_LENGTH
        );
    }
    return entropy;
  };

  /*
   * Adapted from https://github.com/juanelas/bigint-conversion
   * MIT License Copyright (c) 2018 Juan Hernández Serrano
   */
  private static bufToBigInt = (buf: Uint8Array): BigInt => {
    let bits = 8n;

    let value = 0n;
    for (const i of buf.values()) {
      const bi = BigInt(i);
      value = (value << bits) + bi;
    }

    return value;
  };
}
