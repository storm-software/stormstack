import { BaseComponentProps } from "@open-system/design-system-components";
import { Document } from "@react-pdf/renderer";
import { PDFVersion } from "../types";

interface OnPdfRenderProps {
  blob?: Blob;
}

export interface PdfDocumentProps extends BaseComponentProps {
  isUIComponent?: boolean;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  keywords?: string;
  producer?: string;
  language?: string;
  pdfVersion?: PDFVersion;
  onRender?: (props: OnPdfRenderProps) => any;
}

export function PdfDocument({
  language = process.env.DEFAULT_LOCALE,
  isUIComponent = false,
  creator = "Open-System",
  producer = "Open-System",
  pdfVersion = "1.3",
  children,
  ...props
}: PdfDocumentProps) {
  return (
    <Document
      language={language}
      creator={creator}
      producer={producer}
      pdfVersion={pdfVersion}
      {...props}>
      {children}
    </Document>
  );
}
