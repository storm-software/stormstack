import { dash, snake } from "radash";

/**
 * Upper case the first character of an input string.
 * @example ThisIsAnExample
 */
export const upperCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toUpperCase() + input.substr(1) : input;
};

/**
 * Lower case the first character of an input string.
 * @example thisIsAnExample
 */
export const lowerCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toLowerCase() + input.substr(1) : input;
};

/**
 * Convert the input string to kebab case.
 * @example this-is-an-example
 */
export const kebabCase = (input?: string): string | undefined => {
  return dash(input);
};

/**
 * Convert the input string to snake case.
 * @example this_is_an_example
 */
export const snakeCase = (input?: string): string | undefined => {
  return snake(input);
};

/**
 * Convert the input string to constant case.
 * @example THIS_IS_AN_EXAMPLE
 */
export const constantCase = (input?: string): string | undefined => {
  return snake(input).toUpperCase();
};
