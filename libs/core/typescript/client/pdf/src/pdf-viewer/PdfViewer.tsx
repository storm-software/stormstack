/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFViewer as PDFViewerExt } from "@react-pdf/renderer";
import { BaseComponentProps } from "@stormstack/design-system-components";

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
