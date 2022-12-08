export type InputTypes =
  | "text"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export const InputTypes = {
  TEXT: "text" as InputTypes,
  NUMBER: "number" as InputTypes,
  DATE: "date" as InputTypes,
  TIME: "time" as InputTypes,
  DATE_TIME: "datetime-local" as InputTypes,
  EMAIL: "email" as InputTypes,
  PASSWORD: "password" as InputTypes,
  FILE: "file" as InputTypes,
  WEEK: "week" as InputTypes,
  MONTH: "month" as InputTypes,
  TEL: "tel" as InputTypes,
  URL: "url" as InputTypes,
  SEARCH: "search" as InputTypes,
  COLOR: "color" as InputTypes,
};

export type InputModeTypes =
  | "none"
  | "text"
  | "tel"
  | "email"
  | "url"
  | "numeric"
  | "decimal"
  | "search";
export const InputModeTypes = {
  NONE: "none" as InputModeTypes,
  TEXT: "text" as InputModeTypes,
  TEL: "tel" as InputModeTypes,
  URL: "url" as InputModeTypes,
  SEARCH: "search" as InputModeTypes,
  NUMERIC: "numeric" as InputModeTypes,
  DECIMAL: "decimal" as InputModeTypes,
  EMAIL: "email" as InputModeTypes,
};

export type InputAutoCompleteTypes =
  | "off"
  | "on"
  | "tel"
  | "tel-extension"
  | "url"
  | "sex"
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "family-name"
  | "nickname"
  | "email"
  | "username"
  | "current-password"
  | "new-password"
  | "one-time-code"
  | "organization"
  | "organization-title"
  | "street-address"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "cc-name"
  | "cc-number"
  | "cc-exp"
  | "cc-csc"
  | "cc-type"
  | "bday"
  | "language"
  | "transaction-amount"
  | "transaction-currency";
export const InputAutoCompleteTypes = {
  OFF: "off" as InputAutoCompleteTypes,
  ON: "on" as InputAutoCompleteTypes,
  TEL: "tel" as InputAutoCompleteTypes,
  TEL_EXTENSION: "tel-extension" as InputAutoCompleteTypes,
  URL: "url" as InputAutoCompleteTypes,
  SEX: "sex" as InputAutoCompleteTypes,
  NAME: "name" as InputAutoCompleteTypes,
  PREFIX_NAME: "honorific-prefix" as InputAutoCompleteTypes,
  FIRST_NAME: "given-name" as InputAutoCompleteTypes,
  LAST_NAME: "family-name" as InputAutoCompleteTypes,
  NICKNAME: "nickname" as InputAutoCompleteTypes,
  EMAIL: "email" as InputAutoCompleteTypes,
  USERNAME: "username" as InputAutoCompleteTypes,
  PASSWORD: "current-password" as InputAutoCompleteTypes,
  NEW_PASSWORD: "new-password" as InputAutoCompleteTypes,
  ONE_TIME_CODE: "one-time-code" as InputAutoCompleteTypes,
  ORG: "organization" as InputAutoCompleteTypes,
  ORG_TITLE: "organization-title" as InputAutoCompleteTypes,
  ADDRESS: "street-address" as InputAutoCompleteTypes,
  CITY: "address-level2" as InputAutoCompleteTypes,
  STATE: "address-level1" as InputAutoCompleteTypes,
  COUNTRY: "country" as InputAutoCompleteTypes,
  COUNTRY_NAME: "country-name" as InputAutoCompleteTypes,
  CC_NAME: "cc-name" as InputAutoCompleteTypes,
  CC_NUMBER: "cc-number" as InputAutoCompleteTypes,
  CC_EXPIRE: "cc-exp" as InputAutoCompleteTypes,
  CC_CSC: "cc-csc" as InputAutoCompleteTypes,
  CC_TYPE: "cc-type" as InputAutoCompleteTypes,
  BIRTHDAY: "bday" as InputAutoCompleteTypes,
  LANGUAGE: "language" as InputAutoCompleteTypes,
  AMOUNT: "transaction-amount" as InputAutoCompleteTypes,
  CURRENCY: "transaction-currency" as InputAutoCompleteTypes,
};
