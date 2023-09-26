import { Document } from "@react-pdf/renderer";
import { BaseComponentProps } from "@stormstack/design-system-components";
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
  language = "en-US",
  isUIComponent = false,
  creator = "Open-System",
  producer = "Storm Software (stormcloud.dev)",
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
