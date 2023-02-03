"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { PDFViewer as PDFViewerExt } from "@react-pdf/renderer";

export type PdfViewerProps = BaseComponentProps & {
  width?: number | string;
  height?: number | string;
  children?: any;
  className?: string;
  innerRef?: React.Ref<HTMLIFrameElement>;
  showToolbar?: boolean;
};

export function PdfViewer({ children, ...props }: PdfViewerProps) {
  return <PDFViewerExt {...props}>{children}</PDFViewerExt>;
}
