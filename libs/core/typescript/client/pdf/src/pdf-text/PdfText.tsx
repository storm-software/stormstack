import { BaseComponentProps } from "@open-system/design-system-components";
import { Text } from "@react-pdf/renderer";
import { HyphenationCallback, PdfNodeProps } from "../types";

export type PdfTextProps = BaseComponentProps &
  PdfNodeProps & {
    id?: string;
    /**
     * Enable/disable page wrapping for element.
     * @see https://react-pdf.org/components#page-wrapping
     */
    wrap?: boolean;
    /**
     * Enables debug mode on page bounding box.
     * @see https://react-pdf.org/advanced#debugging
     */
    debug?: boolean;
    render?: (props: {
      pageNumber: number;
      totalPages: number;
      subPageNumber: number;
      subPageTotalPages: number;
    }) => React.ReactNode;
    /**
     * Override the default hyphenation-callback
     * @see https://react-pdf.org/fonts#registerhyphenationcallback
     */
    hyphenationCallback?: HyphenationCallback;
    /**
     * Specifies the minimum number of lines in a text element that must be shown at the bottom of a page or its container.
     * @see https://react-pdf.org/advanced#orphan-&-widow-protection
     */
    orphans?: number;
    /**
     * Specifies the minimum number of lines in a text element that must be shown at the top of a page or its container..
     * @see https://react-pdf.org/advanced#orphan-&-widow-protection
     */
    widows?: number;
  };

export function PdfText({
  wrap = true,
  debug = false,
  children,
  ...props
}: PdfTextProps) {
  return (
    <Text wrap={wrap} debug={debug} {...props}>
      {children}
    </Text>
  );
}
