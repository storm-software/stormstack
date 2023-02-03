import {
  PdfImage,
  PdfLink,
  PdfText,
  pdfTw,
  PdfView,
} from "@open-system/shared-ui-feature-pdf";
import titleIcon from "../../assets/title-icon.png";

export function PdfResumeTitle() {
  return (
    <PdfView style={pdfTw("px-12 py-8 bg-slate-700 flex flex-row gap-6")}>
      <PdfImage style={pdfTw("h-16 pr-4")} src={titleIcon.src} />
      <PdfView style={pdfTw("flex flex-col gap-3")}>
        <PdfText style={pdfTw("text-md font-anybody-bold text-white")}>
          Patrick Sullivan
        </PdfText>
        <PdfText style={pdfTw("text-md font-anybody-light text-slate-300")}>
          Software Engineer / Architect
        </PdfText>
        <PdfView style={pdfTw("flex flex-row gap-4")}>
          <PdfText style={pdfTw("text-sm font-anybody text-slate-100")}>
            New York Metropolitan Area
          </PdfText>
          <PdfText style={pdfTw("text-sm font-anybody text-slate-100")}>
            {" "}
            •{" "}
          </PdfText>
          <PdfLink
            style={pdfTw("text-sm font-anybody text-slate-100 no-underline")}
            src="https://pat-sullivan.com">
            pat-sullivan.com
          </PdfLink>
          <PdfText style={pdfTw("text-sm font-anybody text-slate-100")}>
            {" "}
            •{" "}
          </PdfText>
          <PdfText style={pdfTw("text-sm font-anybody text-slate-100")}>
            patrick.joseph.sullivan@protonmail.com
          </PdfText>
        </PdfView>
      </PdfView>
    </PdfView>
  );
}
