import tinycolor from "tinycolor2";
import { ShadowToken } from "../../../types";
import { OptionsType } from "../to-tailwind.parser";
import { ShadowMapping } from "../to-tailwind.type";
import { Utils } from "./index";

export class Shadow extends ShadowToken {
  token: Partial<ShadowToken>;
  constructor(token: Partial<ShadowToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): ShadowMapping {
    return {
      boxShadow: Utils.go<ConstructorParameters<typeof ShadowToken>[0]>(
        this.token,
        options,
        "boxShadow",
        this.value
          .reduce<Array<string>>((acc, shadow) => {
            const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
            const x = `${offsetX}px`;
            const y = `${offsetY}px`;
            const blurString = `${blur}px`;
            const spreadString = spread ? ` ${spread}px` : "";
            const innerText = isInner ? "inset " : "";
            const colorString = tinycolor(color).toString(
              options?.formatTokens?.colorFormat?.format ?? "hex"
            );
            acc.push(
              `${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`
            );
            return acc;
          }, [])
          .join(", ")
      ),
    };
  }
}
