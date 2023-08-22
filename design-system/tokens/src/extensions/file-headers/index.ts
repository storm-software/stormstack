/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CustomFileHeadersBuilder,
  ExtensionContext,
} from "@nxkit/style-dictionary/extensions";

const customFileHeadersBuilder: CustomFileHeadersBuilder = (
  _: ExtensionContext
) => {
  return {
    myCustomHeader: function (defaultMessage) {
      return [
        `
*******************************
*                             *
*         Open System         *
*  ⚡Impact Design System⚡  *
*                             *
*******************************

`,
        ...defaultMessage,
      ];
    },
  };
};

export default customFileHeadersBuilder;
