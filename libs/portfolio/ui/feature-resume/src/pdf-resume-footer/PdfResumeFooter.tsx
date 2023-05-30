import { DateTime } from "@open-system/core-typescript-utilities";
import { PdfText, pdfTw, PdfView } from "@open-system/core-feature-pdf";

export function PdfResumeFooter() {
  return (
    <PdfView style={pdfTw("p-6 bg-slate-700 flex flex-row justify-end")}>
      <PdfText style={pdfTw("text-sm font-anybody-bold text-slate-200")}>
        Generated on {DateTime.current?.getPlainDate().toLocaleString()}
      </PdfText>
    </PdfView>
  );
}
