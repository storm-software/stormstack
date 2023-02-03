import { BaseComponentProps } from "@open-system/design-system-components";
import { Page } from "@react-pdf/renderer";
import { Bookmark, Orientation, PageSize, PdfNodeProps } from "../types";

export type PdfPageProps = BaseComponentProps &
  PdfNodeProps & {
    /**
     * Enable page wrapping for this page.
     * @see https://react-pdf.org/components#page-wrapping
     */
    wrap?: boolean;
    /**
     * Enables debug mode on page bounding box.
     * @see https://react-pdf.org/advanced#debugging
     */
    debug?: boolean;
    size?: PageSize;
    orientation?: Orientation;
    dpi?: number;
    bookmark?: Bookmark;
  };

export function PdfPage({
  size = "A4",
  orientation = "portrait",
  wrap = true,
  debug = false,
  dpi = 72,
  children,
  ...props
}: PdfPageProps) {
  return (
    <Page
      size={size}
      orientation={orientation}
      wrap={wrap}
      debug={debug}
      dpi={dpi}
      {...props}>
      {children}
    </Page>
  );
}
