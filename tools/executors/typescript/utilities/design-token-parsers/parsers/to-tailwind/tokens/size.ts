import { SizeToken } from "../../../types/tokens/Size";
import { OptionsType } from "../to-tailwind.parser";
import { SizeMapping, TailwindMappingTypes } from "../to-tailwind.type";
import { Utils } from "./index";

export class Size extends SizeToken {
  token: Partial<SizeToken>;

  constructor(token: Partial<SizeToken>) {
    super(token);
    this.token = token;
    this.value = token.value!;
  }
  generate(options: OptionsType): SizeMapping {
    return {
      height: Utils.go<ConstructorParameters<typeof SizeToken>[0]>(
        this.token,
        options,
        "height",
        `${this.value.measure ?? this.value}${this.value.unit ?? "px"}`
      ),
      width: Utils.go<ConstructorParameters<typeof SizeToken>[0]>(
        this.token,
        options,
        "width",
        `${this.value.measure ?? this.value}${this.value.unit ?? "px"}`
      ),
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.height) tokens.height = Utils.sortObjectByValue(tokens.height!);
    if (tokens.width) tokens.width = Utils.sortObjectByValue(tokens.width!);
    return tokens;
  }
}
