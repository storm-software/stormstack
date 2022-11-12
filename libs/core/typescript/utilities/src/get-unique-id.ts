import { customAlphabet, nanoid } from "nanoid/non-secure";

/**
 * Returns back a unique Id string
 *
 * @remarks Currently using Nano ID to generate this string. Please see {@link https://zelark.github.io/nano-id-cc/ | the Nano ID documentation} for more information.
 *
 * @param size - The size of the Id. The default size is 21.
 * @returns A unique Id string
 */
export const getUniqueId = (size?: number | undefined): string => nanoid(size);

/**
 * Returns back a unique numeric Id string
 *
 * @remarks Currently using Nano ID to generate this string. Please see {@link https://zelark.github.io/nano-id-cc/ | the Nano ID documentation} for more information.
 *
 * @param size - The size of the Id. The default size is 21.
 * @returns A unique Id string
 */
export const getUniqueNumericId = (size?: number | undefined): string =>
  customAlphabet("1234567890", size)(size);
