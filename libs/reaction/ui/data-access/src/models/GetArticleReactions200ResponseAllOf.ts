/**
 * Engagement
 * A collection of APIs used to get and set user reactions and comments for an article/page
 *
 * OpenAPI spec version: 1.0
 * Contact: Patrick.Joseph.Sullivan@protonmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ReactionDetail } from "./ReactionDetail";
import { HttpFile } from "@open-system/core-typescript-utilities";

export class GetArticleReactions200ResponseAllOf {
  /**
   * The id of the article/page
   */
  "articleId": string;
  /**
   * The list of reactions for the specified article
   */
  "reactions": Array<ReactionDetail>;

  static readonly discriminator: string | undefined = undefined;

  static readonly attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
    format: string;
  }> = [
    {
      "name": "articleId",
      "baseName": "articleId",
      "type": "string",
      "format": "",
    },
    {
      "name": "reactions",
      "baseName": "reactions",
      "type": "Array<ReactionDetail>",
      "format": "",
    },
  ];

  static getAttributeTypeMap() {
    return GetArticleReactions200ResponseAllOf.attributeTypeMap;
  }

  public constructor() {}
}