import { dash, pascal, snake, title } from "radash";

/**
 * Upper case the first character of an input string.
 * @example Thisisanexample
 */
export const upperCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toUpperCase() + input.substr(1) : input;
};

/**
 * Lower case the first character of an input string.
 * @example tHISISANEXAMPLE
 */
export const lowerCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toLowerCase() + input.substr(1) : input;
};

/**
 * Convert the input string to kebab case.
 * @example this-is-an-example
 */
export const kebabCase = (input?: string): string | undefined => {
  return input ? dash(input) : input;
};

/**
 * Convert the input string to snake case.
 * @example this_is_an_example
 */
export const snakeCase = (input?: string): string | undefined => {
  return input ? snake(input) : input;
};

/**
 * Convert the input string to constant case.
 * @example THIS_IS_AN_EXAMPLE
 */
export const constantCase = (input?: string): string | undefined => {
  return snakeCase(input)?.toUpperCase();
};

/**
 * Convert the input string to title case.
 * @example This Is An Example
 */
export const titleCase = (input?: string): string | undefined => {
  return input ? title(input) : input;
};

/**
 * Convert the input string to pascal case.
 * @example thisIsAnExample
 */
export const pascalCase = (input?: string): string | undefined => {
  return input ? pascal(input).toUpperCase() : input;
};
