"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { PDFDownloadLink as PDFDownloadLinkExt } from "@react-pdf/renderer";
import { PdfDocumentProps } from "../pdf-document";
import { BlobProviderParams } from "../types";

export type PdfDownloadLinkProps = BaseComponentProps & {
  document: React.ReactElement<PdfDocumentProps>;
  fileName?: string;
  className?: string;
  children?:
    | React.ReactNode
    | ((params: BlobProviderParams) => React.ReactNode);
  onClick?: (event?: any) => any;
};

export function PdfDownloadLink({ children, ...props }: PdfDownloadLinkProps) {
  return <PDFDownloadLinkExt {...props}>{children}</PDFDownloadLinkExt>;
}
