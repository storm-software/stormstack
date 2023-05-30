import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@react-pdf/renderer";
import { PdfNodeProps } from "../types";

export type PdfLinkProps = BaseComponentProps &
  PdfNodeProps & {
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
    src: string;
  };

export function PdfLink({
  wrap = true,
  debug = false,
  children,
  ...props
}: PdfLinkProps) {
  return (
    <Link wrap={wrap} debug={debug} {...props}>
      {children}
    </Link>
  );
}
