import { BaseComponentProps } from "@open-system/design-system-components";
import { PdfText, pdfTw, PdfView } from "@open-system/shared-ui-feature-pdf";
import clsx from "clsx";

export type PdfResumeSectionProps = BaseComponentProps & {
  title: string;
};

export function PdfResumeSection({
  title,
  children,
  className,
  ...props
}: PdfResumeSectionProps) {
  return (
    <>
      <PdfView style={pdfTw(clsx("pb-4", className))}>
        <PdfText
          style={pdfTw(
            "text-md font-anybody-bold text-teal-600 border-b-2 border-b-slate-700"
          )}>
          {title}
        </PdfText>
      </PdfView>
      {children}
    </>
  );
}
