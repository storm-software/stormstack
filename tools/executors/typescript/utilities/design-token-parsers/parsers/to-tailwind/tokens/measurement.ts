import { MeasurementToken } from "../../../types";
import { OptionsType } from "../to-tailwind.parser";
import { MeasurementMapping, TailwindMappingTypes } from "../to-tailwind.type";
import { Utils } from "./index";

export class Measurement extends MeasurementToken {
  token: Partial<MeasurementToken>;
  constructor(token: Partial<MeasurementToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): MeasurementMapping {
    console.log(this.value);
    return {
      spacing: Utils.go<ConstructorParameters<typeof MeasurementToken>[0]>(
        this.token,
        options,
        "spacing",
        `${
          (this.value as any).top
            ? `${(this.value as any).top}px`
            : (this.value as any).bottom
            ? `${(this.value as any).bottom}px`
            : (this.value as any).left
            ? `${(this.value as any).left}px`
            : (this.value as any).right
            ? `${(this.value as any).right}px`
            : "0px"
        }`
      ),
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.spacing)
      tokens.spacing = Utils.sortObjectByValue(tokens.spacing!);
    return tokens;
  }
}
