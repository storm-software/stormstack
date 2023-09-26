import { PdfText, pdfTw, PdfView } from "@stormstack/core-client-pdf";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { PdfResumeHeading } from "../pdf-resume-heading";
import { PdfResumeParagraph } from "../pdf-resume-paragraph";

export type PdfResumeItemProps = BaseComponentProps & {
  header: string;
  detail: string;
  timeline: string;
};

export function PdfResumeItem({
  header,
  detail,
  timeline,
  children,
  ...props
}: PdfResumeItemProps) {
  return (
    <PdfView style={pdfTw("flex flex-col pb-4")}>
      <PdfView style={pdfTw("flex flex-row gap-8")}>
        <PdfResumeHeading>{header}</PdfResumeHeading>
        <PdfText style={pdfTw("text-sm font-anybody-light")}>{detail}</PdfText>
        <PdfView style={pdfTw("flex flex-row-reverse flex-1 grow")}>
          <PdfText style={pdfTw("text-sm font-anybody")}>{timeline}</PdfText>
        </PdfView>
      </PdfView>
      <PdfResumeParagraph>{children}</PdfResumeParagraph>
    </PdfView>
  );
}
