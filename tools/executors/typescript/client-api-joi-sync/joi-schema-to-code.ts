/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Joi, { Description } from "joi";

type PresenceType = "optional" | "required" | "forbidden";

type FlagsType = {
  default?: any;
  description?: any;
  encoding?: string;
  label?: string;
  format?: "iso" | "javascript" | "unix";
  insensitive?: boolean;
  only?: boolean;
  presence?: PresenceType;
  result?: string;
  sensitive?: boolean;
  single?: boolean;
  sparse?: boolean;
  truncate?: boolean;
  unit?: string;
  unknown?: boolean;
  unsafe?: boolean;
  match?: "all" | "one" | "any";
};

type PreferencesType = {
  convert?: boolean;
};

type RuleType = {
  name: string;
  args: Record<string, any>;
};

type DependencyType = {
  rel: string;
  peers: string[];
};

const appendAllow = (parts: string[], description: Description) => {
  const values = (description as any).allow as any[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.allow(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendAlphanum = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "alphanum"
  );
  if (rule !== undefined) {
    parts.push(".alphanum()");
  }
};

const appendAnd = (parts: string[], description: Description) => {
  const dependency = (
    ((description as any).dependencies ?? []) as DependencyType[]
  ).find(it => it.rel === "and");
  if (dependency !== undefined) {
    parts.push(
      `.and(${dependency.peers.map(it => JSON.stringify(it)).join(",")})`
    );
  }
};

const appendNonStringLength = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "length"
  );
  if (rule !== undefined) {
    parts.push(`.length(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendBase64 = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "base64"
  );
  if (rule !== undefined) {
    parts.push(`.base64(${JSON.stringify(rule.args.options ?? {})})`);
  }
};

const appendCase = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "case"
  );
  if (rule?.args?.direction === "upper") {
    parts.push(".uppercase()");
  } else if (rule?.args?.direction === "lower") {
    parts.push(".lowercase()");
  }
};

const appendCreditCard = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "creditCard"
  );
  if (rule !== undefined) {
    parts.push(".creditCard()");
  }
};

const appendDataUri = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "dataUri"
  );
  if (rule !== undefined) {
    parts.push(`.dataUri(${JSON.stringify(rule.args.options ?? {})})`);
  }
};

const appendDateGreater = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "greater"
  );
  if (rule !== undefined) {
    parts.push(`.greater(${JSON.stringify(rule.args.date)})`);
  }
};

const appendDateLess = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "less"
  );
  if (rule !== undefined) {
    parts.push(`.less(${JSON.stringify(rule.args.date)})`);
  }
};

const appendDateMax = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "max"
  );
  if (rule !== undefined) {
    parts.push(`.max(${JSON.stringify(rule.args.date)})`);
  }
};

const appendDateMin = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "min"
  );
  if (rule !== undefined) {
    parts.push(`.min(${JSON.stringify(rule.args.date)})`);
  }
};

const appendDefault = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.default !== undefined) {
    parts.push(`.default(${JSON.stringify(flags.default)})`);
  }
};

const appendDescription = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.description !== undefined && flags?.description !== "") {
    parts.push(`.description(${JSON.stringify(flags.description)})`);
  }
};

const appendDomain = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "domain"
  );
  if (rule !== undefined) {
    parts.push(`.domain(${JSON.stringify(rule.args?.options ?? {})})`);
  }
};

const appendEmail = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "email"
  );
  if (rule !== undefined) {
    parts.push(`.email(${JSON.stringify(rule.args?.options ?? {})})`);
  }
};

const appendEncoding = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.encoding !== undefined) {
    parts.push(`.encoding(${JSON.stringify(flags.encoding)})`);
  }
};

const appendExample = (parts: string[], description: Description) => {
  const values = (description as any).examples as any[] | undefined;
  if (values !== undefined) {
    parts.push(`.example(${JSON.stringify(values[0])})`);
  }
};

const appendFalsy = (parts: string[], description: Description) => {
  const values = (description as any).falsy as any[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.falsy(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendForbidden = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.presence === "forbidden") {
    parts.push(`.forbidden()`);
  }
};

const appendGuid = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "guid"
  );
  if (rule !== undefined) {
    parts.push(`.guid(${JSON.stringify(rule.args?.options ?? {})})`);
  }
};

const appendHex = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "hex"
  );
  if (rule !== undefined) {
    parts.push(`.hex(${JSON.stringify(rule.args.options ?? {})})`);
  }
};

const appendHostname = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "hostname"
  );
  if (rule !== undefined) {
    parts.push(".hostname()");
  }
};

const appendInsensitive = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.insensitive === true) {
    parts.push(".insensitive()");
  }
};

const appendInteger = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "integer"
  );
  if (rule !== undefined) {
    parts.push(".integer()");
  }
};

const appendInvalid = (parts: string[], description: Description) => {
  const values = (description as any).invalid as any[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.invalid(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendIp = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "ip"
  );
  if (rule !== undefined) {
    parts.push(`.ip(${JSON.stringify(rule.args.options ?? {})})`);
  }
};

const appendIso = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.format === "iso") {
    parts.push(".iso()");
  }
};

const appendIsoDate = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "isoDate"
  );
  if (rule !== undefined) {
    parts.push(".isoDate()");
  }
};

const appendIsoDuration = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "isoDuration"
  );
  if (rule !== undefined) {
    parts.push(".isoDuration()");
  }
};

const appendItems = (parts: string[], description: Description) => {
  const items = (description as any).items as Description[] | undefined;
  if (items !== undefined) {
    parts.push(`.items(${items.map(it => descriptionToString(it)).join(",")})`);
  }
};

const appendLabel = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.label !== undefined) {
    parts.push(`.label(${JSON.stringify(flags.label)})`);
  }
};

const appendMultiple = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "multiple"
  );
  if (rule !== undefined) {
    parts.push(`.multiple(${JSON.stringify(rule.args.base)})`);
  }
};

const appendNand = (parts: string[], description: Description) => {
  const dependency = (
    ((description as any).dependencies ?? []) as DependencyType[]
  ).find(it => it.rel === "nand");
  if (dependency !== undefined) {
    parts.push(
      `.nand(${dependency.peers.map(it => JSON.stringify(it)).join(",")})`
    );
  }
};

const appendNonStringMax = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "max"
  );
  if (rule !== undefined) {
    parts.push(`.max(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendNonStringMin = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "min"
  );
  if (rule !== undefined) {
    parts.push(`.min(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendNote = (parts: string[], description: Description) => {
  const values = (description as any).notes as string[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.note(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendNormalize = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "normalize"
  );
  if (rule !== undefined) {
    parts.push(`.normalize(${JSON.stringify(rule.args.form ?? "NFC")})`);
  }
};

const appendNumberGreater = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "greater"
  );
  if (rule !== undefined) {
    parts.push(`.greater(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendNumberLess = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "less"
  );
  if (rule !== undefined) {
    parts.push(`.less(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendOnly = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.only === true) {
    parts.push(`.only()`);
  }
};

const appendOr = (parts: string[], description: Description) => {
  const dependency = (
    ((description as any).dependencies ?? []) as DependencyType[]
  ).find(it => it.rel === "or");
  if (dependency !== undefined) {
    parts.push(
      `.or(${dependency.peers.map(it => JSON.stringify(it)).join(",")})`
    );
  }
};

const appendOptional = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.presence === "optional") {
    parts.push(`.optional()`);
  }
};

const appendOrdered = (parts: string[], description: Description) => {
  const items = (description as any).ordered as Description[] | undefined;
  if (items !== undefined) {
    parts.push(
      `.ordered(${items.map(it => descriptionToString(it)).join(",")})`
    );
  }
};

const appendOxor = (parts: string[], description: Description) => {
  const dependency = (
    ((description as any).dependencies ?? []) as DependencyType[]
  ).find(it => it.rel === "oxor");
  if (dependency !== undefined) {
    parts.push(
      `.oxor(${dependency.peers.map(it => JSON.stringify(it)).join(",")})`
    );
  }
};

const appendPattern = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "pattern"
  );
  if (rule !== undefined) {
    parts.push(
      `.pattern(${rule.args.regex},${JSON.stringify(rule.args.options ?? {})})`
    );
  }
};

const appendPort = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "port"
  );
  if (rule !== undefined) {
    parts.push(".port()");
  }
};

const appendPrecision = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "precision"
  );
  if (rule !== undefined) {
    parts.push(`.precision(${JSON.stringify(rule.args.limit)})`);
  }
};

const appendRaw = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.result === "raw") {
    parts.push(`.raw()`);
  }
};

const appendRegex = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "regex"
  );
  if (rule !== undefined) {
    parts.push(".regex()");
  }
};

const appendReplace = (parts: string[], description: Description) => {
  const values = (description as any).replacements as
    | { pattern: { regex: string }; replacement: string }[]
    | undefined;
  if (values !== undefined) {
    parts.push(
      `.replace(${values[0].pattern.regex}, ${JSON.stringify(
        values[0].replacement
      )})`
    );
  }
};

const appendRequired = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.presence === "required") {
    parts.push(`.required()`);
  }
};

const appendSensitive = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.sensitive === true) {
    parts.push(`.sensitive()`);
  }
};

const appendSign = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "sign"
  );
  if (rule?.args?.sign === "negative") {
    parts.push(".negative()");
  } else if (rule?.args?.sign === "positive") {
    parts.push(".positive()");
  }
};

const appendSingle = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.single === true) {
    parts.push(`.single()`);
  }
};

const appendSparse = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.sparse === true) {
    parts.push(`.sparse()`);
  }
};

const appendStringLength = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "length"
  );
  if (rule !== undefined) {
    const { encoding } = rule.args;
    parts.push(
      `.length(${[
        JSON.stringify(rule.args?.limit),
        encoding !== undefined ? JSON.stringify(encoding) : undefined,
      ]
        .filter(it => !!it)
        .join(",")})`
    );
  }
};

const appendStringMax = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "max"
  );
  if (rule !== undefined) {
    const { encoding } = rule.args;
    parts.push(
      `.max(${[
        JSON.stringify(rule.args?.limit),
        encoding !== undefined ? JSON.stringify(encoding) : undefined,
      ]
        .filter(it => !!it)
        .join(",")})`
    );
  }
};

const appendStringMin = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "min"
  );
  if (rule !== undefined) {
    const { encoding } = rule.args;
    parts.push(
      `.min(${[
        JSON.stringify(rule.args?.limit),
        encoding !== undefined ? JSON.stringify(encoding) : undefined,
      ]
        .filter(it => !!it)
        .join(",")})`
    );
  }
};

const appendStrict = (parts: string[], description: Description) => {
  const preferences = description.preferences as PreferencesType | undefined;
  if (preferences?.convert === false) {
    parts.push(`.strict()`);
  }
};

const appendTag = (parts: string[], description: Description) => {
  const values = (description as any).tags as string[] | undefined;
  if (values !== undefined) {
    parts.push(`.tag(${values.map(value => JSON.stringify(value)).join(",")})`);
  }
};

const appendTimestamp = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.format === "unix") {
    parts.push('.timestamp("unix")');
  } else if (flags?.format === "javascript") {
    parts.push('.timestamp("javascript")');
  }
};

const appendToken = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "token"
  );
  if (rule !== undefined) {
    parts.push(".token()");
  }
};

const appendTrim = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "trim"
  );
  if (rule !== undefined) {
    parts.push(`.trim(${JSON.stringify(rule.args.enabled !== false)})`);
  }
};

const appendTruncate = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.truncate === true) {
    parts.push(".truncate()");
  }
};

const appendTruthy = (parts: string[], description: Description) => {
  const values = (description as any).truthy as any[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.truthy(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendUnique = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "unique"
  );
  if (rule !== undefined) {
    parts.push(
      `.unique(${JSON.stringify(rule.args?.comparator)},${JSON.stringify(
        rule.args?.options
      )})`
    );
  }
};

const appendUnit = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.unit !== undefined) {
    parts.push(`.unit(${JSON.stringify(flags.unit)})`);
  }
};

const appendUnknown = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.unknown === true) {
    parts.push(".unknown()");
  }
};

const appendUnsafe = (parts: string[], description: Description) => {
  const flags = description.flags as FlagsType | undefined;
  if (flags?.unsafe === true) {
    parts.push(".unsafe()");
  }
};

const appendUri = (parts: string[], description: Description) => {
  const rule = (description.rules as RuleType[] | undefined)?.find(
    it => it.name === "uri"
  );
  if (rule !== undefined) {
    parts.push(`.uri(${JSON.stringify(rule.args?.options ?? {})})`);
  }
};

const appendValid = (parts: string[], description: Description) => {
  const values = (description as any).valid as any[] | undefined;
  if (values !== undefined) {
    parts.push(
      `.valid(${values.map(value => JSON.stringify(value)).join(",")})`
    );
  }
};

const appendXor = (parts: string[], description: Description) => {
  const dependency = (
    ((description as any).dependencies ?? []) as DependencyType[]
  ).find(it => it.rel === "xor");
  if (dependency !== undefined) {
    parts.push(
      `.xor(${dependency.peers.map(it => JSON.stringify(it)).join(",")})`
    );
  }
};

const appendCommon = (parts: string[], description: Description) => {
  appendAllow(parts, description);
  appendDefault(parts, description);
  appendDescription(parts, description);
  appendExample(parts, description);
  appendForbidden(parts, description);
  appendInvalid(parts, description);
  appendLabel(parts, description);
  appendNote(parts, description);
  appendOnly(parts, description);
  appendOptional(parts, description);
  appendRaw(parts, description);
  appendRequired(parts, description);
  appendStrict(parts, description);
  appendTag(parts, description);
  appendUnit(parts, description);
  appendValid(parts, description);
};

const anyDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.any()"];

  appendCommon(parts, description);

  return parts.join("");
};

const arrayDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.array()"];

  appendCommon(parts, description);
  appendNonStringLength(parts, description);
  appendItems(parts, description);
  appendNonStringMax(parts, description);
  appendNonStringMin(parts, description);
  appendOrdered(parts, description);
  appendSingle(parts, description);
  appendSparse(parts, description);
  appendUnique(parts, description);

  return parts.join("");
};

const binaryDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.binary()"];

  appendCommon(parts, description);
  appendEncoding(parts, description);
  appendNonStringLength(parts, description);
  appendNonStringMax(parts, description);
  appendNonStringMin(parts, description);

  return parts.join("");
};

const booleanDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.boolean()"];

  appendCommon(parts, description);
  appendFalsy(parts, description);
  appendSensitive(parts, description);
  appendTruthy(parts, description);

  return parts.join("");
};

const dateDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.date()"];

  appendCommon(parts, description);
  appendDateGreater(parts, description);
  appendIso(parts, description);
  appendDateLess(parts, description);
  appendDateMax(parts, description);
  appendDateMin(parts, description);
  appendTimestamp(parts, description);

  return parts.join("");
};

const numberDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.number()"];

  appendCommon(parts, description);
  appendNumberGreater(parts, description);
  appendInteger(parts, description);
  appendNumberLess(parts, description);
  appendNonStringMax(parts, description);
  appendNonStringMin(parts, description);
  appendMultiple(parts, description);
  appendPort(parts, description);
  appendPrecision(parts, description);
  appendSign(parts, description);
  appendUnsafe(parts, description);

  return parts.join("");
};

const objectDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.object({"];
  const keys = ((description as any).keys ?? {}) as Record<string, Description>;

  parts.push(
    Object.entries(keys)
      .map(
        ([key, value]) =>
          `${JSON.stringify(key)}: ${descriptionToString(value)}`
      )
      .join(",")
  );
  parts.push("})");
  appendCommon(parts, description);
  appendAnd(parts, description);
  appendNonStringLength(parts, description);
  appendNonStringMax(parts, description);
  appendNonStringMin(parts, description);
  appendNand(parts, description);
  appendOr(parts, description);
  appendOxor(parts, description);
  appendRegex(parts, description);
  appendUnknown(parts, description);
  appendXor(parts, description);
  // TODO: Object fields

  return parts.join("");
};

const stringDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.string()"];

  appendCommon(parts, description);
  appendAlphanum(parts, description);
  appendBase64(parts, description);
  appendCase(parts, description);
  appendCreditCard(parts, description);
  appendDataUri(parts, description);
  appendDomain(parts, description);
  appendEmail(parts, description);
  appendGuid(parts, description);
  appendHex(parts, description);
  appendHostname(parts, description);
  appendInsensitive(parts, description);
  appendIp(parts, description);
  appendIsoDate(parts, description);
  appendIsoDuration(parts, description);
  appendNormalize(parts, description);
  appendPattern(parts, description);
  appendReplace(parts, description);
  appendStringLength(parts, description);
  appendStringMax(parts, description);
  appendStringMin(parts, description);
  appendToken(parts, description);
  appendTrim(parts, description);
  appendTruncate(parts, description);
  appendUri(parts, description);

  return parts.join("");
};

const alternativesDescriptionToString = (description: Description) => {
  const parts: string[] = ["Joi.alternatives()"];

  const flags = description.flags as FlagsType | undefined;
  const matchMode = flags?.match || "any";
  parts.push(`.match("${matchMode}")`);

  const matches = (description.matches as any[]).map(match =>
    descriptionToString(match.schema)
  );
  parts.push(`.try(${matches.join(",")})`);

  appendCommon(parts, description);

  return parts.join("");
};

const descriptionToString = (description: Description) => {
  switch (description.type) {
    case "any":
      return anyDescriptionToString(description);

    case "array":
      return arrayDescriptionToString(description);

    case "binary":
      return binaryDescriptionToString(description);

    case "boolean":
      return booleanDescriptionToString(description);

    case "date":
      return dateDescriptionToString(description);

    case "number":
      return numberDescriptionToString(description);

    case "object":
      return objectDescriptionToString(description);

    case "string":
      return stringDescriptionToString(description);

    case "alternatives":
      return alternativesDescriptionToString(description);

    default:
      throw new Error(`Unexpected type: ${description.type}`);
  }
};

const addPresenceToDescription = (
  description: Description,
  presence: PresenceType
) => {
  // eslint-disable-next-line no-param-reassign
  description.flags = { ...(description.flags ?? {}), presence };
};

export default (schema: Joi.AnySchema, presence?: PresenceType) => {
  const description = schema.describe();
  if (presence !== undefined) {
    addPresenceToDescription(description, presence);
  }

  return descriptionToString(description);
};
