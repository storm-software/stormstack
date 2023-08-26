import { dash } from "radash";

/**
 * Upper case the first character of an input string.
 */
export const upperCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toUpperCase() + input.substr(1) : input;
};

/**
 * Lower case the first character of an input string.
 */
export const lowerCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toLowerCase() + input.substr(1) : input;
};

/**
 * Convert the input string to kebab case.
 */
export const kebabCase = (input?: string): string | undefined => {
  return dash(input);
};
