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

export class UniqueIdGenerator {
  /**
   * The generators epoch timestamp in milliseconds.
   *
   * Defaults to "1st of January, 2000, 00:00".
   *
   * @type {number}
   */
  /* c8 ignore end */

  public static EPOCH: number = Date.UTC(1970, 0, 1).valueOf();

  /**
   * The id of the shard running this generator.
   *
   * Defaults to "1".
   *
   * @type {number}
   */
  /* c8 ignore end */

  public static SHARD_ID = 1;

  /**
   * The sequence of the current running generator.
   *
   * Defaults to "1".
   *
   * @type {number}
   */
  /* c8 ignore end */

  public static SEQUENCE = 1;

  /**
   * Generates a single snowflake.
   * @param {Date|number} [timestamp = Date.now] - Timestamp to generate from
   * @returns {bigint}
   */
  /* c8 ignore end */

  public static generate({
    timestamp = Date.now(),
    shardId = UniqueIdGenerator.SHARD_ID
  }: {
    timestamp?: Date | number;
    shardId?: number;
  } = {}): string {
    if (timestamp instanceof Date) timestamp = timestamp.valueOf();
    else timestamp = new Date(timestamp).valueOf();

    // tslint:disable:no-bitwise
    let result =
      (BigInt(timestamp) - BigInt(UniqueIdGenerator.EPOCH)) << BigInt(22);
    result = result | (BigInt(shardId % 1024) << BigInt(12));
    result = result | BigInt(UniqueIdGenerator.SEQUENCE++ % 4096);
    // tslint:enable:no-bitwise
    return result.toString();
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

  public static isValid(snowflake: string) {
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
}
