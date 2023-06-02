/*import SuperJSON from "superjson";

export const stringify = (obj: any) => SuperJSON.stringify(obj);
export const parse = <TValue>(str: string): TValue => SuperJSON.parse(str);

SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: v => v.toJSON(),
    deserialize: v => new Decimal(v),
  },
  'decimal.js'
);*/
