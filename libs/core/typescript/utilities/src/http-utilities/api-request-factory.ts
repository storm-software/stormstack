import { inject, injectable } from "inversify";
import { CustomUtilityClass } from "../common";
import { Tokens } from "../types";
import { AbstractHttpConfiguration } from "./http-configuration";

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "\t",
  pipes: "|",
};

/**
 *
 * @export
 * @class APIRequestFactory
 */
@injectable()
export class APIRequestFactory extends CustomUtilityClass {
  constructor(
    @inject(AbstractHttpConfiguration)
    protected configuration: AbstractHttpConfiguration
  ) {
    super(Tokens.API_REQUEST_FACTORY);
  }
}
