import { BaseComponentProps } from "@open-system/design-system-components";
import { View } from "@react-pdf/renderer";
import { PdfNodeProps } from "../types";

export type PdfViewProps = BaseComponentProps &
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
      subPageNumber: number;
    }) => React.ReactNode;
  };

export function PdfView({
  wrap = true,
  debug = false,
  children,
  ...props
}: PdfViewProps) {
  return (
    <View wrap={wrap} debug={debug} {...props}>
      {children}
    </View>
  );
}
