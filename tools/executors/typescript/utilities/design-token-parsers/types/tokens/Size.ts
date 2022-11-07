import { TokensType } from "./index";
import Token, { TokenInterface } from "./Token";

export interface SizeValue {
  measure: number;
  unit: string;
}

export class SizeToken extends Token implements TokenInterface {
  type: TokensType = "size";
  value: SizeValue;

  constructor(element: Partial<SizeToken>) {
    super(element);
    this.value = element.value!;
  }
}
