import {
  PdfDocument,
  PdfPage,
  pdfTw,
  PdfView
} from "@stormstack/core-client-pdf";
import { PdfResumeFooter } from "../pdf-resume-footer";
import { PdfResumeHeading } from "../pdf-resume-heading";
import { PdfResumeItem } from "../pdf-resume-item";
import { PdfResumeParagraph } from "../pdf-resume-paragraph";
import { PdfResumeSection } from "../pdf-resume-section";
import { PdfResumeTitle } from "../pdf-resume-title";

/* eslint-disable-next-line */
export interface PdfResumeProps {}

/*Font.register({
  family: "var(--font-melody)",
  src: "../../../../../../assets/fonts/BLMelody-Bold.woff2",
});*/

/*Font.register({
  family: "Anybody",
  src: "https://fonts.googleapis.com/css2?family=Anybody&display=swap",
});*/

export function PdfResume(props: PdfResumeProps) {
  return (
    <PdfDocument
      title="Patrick Sullivan - Resume"
      subject="Patrick Sullivan's professional resume document."
      author="Patrick Sullivan"
      creator="Patrick Sullivan"
      producer="Patrick Sullivan">
      <PdfPage style={pdfTw("flex flex-col gap-3")}>
        <PdfResumeTitle />
        <PdfView style={pdfTw("px-12 pt-4 flex-1 grow")}>
          <PdfView style={pdfTw("flex flex-col gap-4 pb-12")}>
            <PdfView style={pdfTw("flex flex-col gap-2")}>
              <PdfResumeSection title="Work Experience">
                <PdfResumeItem
                  header="Lead Software Engineer"
                  detail="Broadridge Financial Solutions"
                  timeline="2019 - Present">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </PdfResumeItem>
                <PdfResumeItem
                  header="Junior Software Engineer"
                  detail="Broadridge Financial Solutions"
                  timeline="2017 - 2019">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </PdfResumeItem>
                <PdfResumeItem
                  header="Software Engineering Intern"
                  detail="Data Device Corporation"
                  timeline="2014 - 2017">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </PdfResumeItem>
                <PdfResumeItem
                  header="Computer Science Tutor"
                  detail="Suffolk Community College"
                  timeline="2012 - 2014">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </PdfResumeItem>
                <PdfResumeItem
                  header="Web Developer"
                  detail="Freelance"
                  timeline="2010 - Present">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </PdfResumeItem>
              </PdfResumeSection>

              <PdfResumeSection title="Education">
                <PdfResumeItem
                  header="Bachelor of Science (B.S.) - Computer Science"
                  detail="Stonybrook University"
                  timeline="2014 - 2017"
                />
              </PdfResumeSection>

              <PdfResumeSection title="Technology">
                <PdfView style={pdfTw("flex flex-row")}>
                  <PdfView style={pdfTw("flex flex-col flex-1")}>
                    <PdfResumeHeading>Client-Side</PdfResumeHeading>
                    <PdfResumeParagraph>React</PdfResumeParagraph>
                    <PdfResumeParagraph>Electron</PdfResumeParagraph>
                    <PdfResumeParagraph>Stencil</PdfResumeParagraph>
                    <PdfResumeParagraph>Style Dictionary</PdfResumeParagraph>
                    <PdfResumeParagraph>Tailwind CSS</PdfResumeParagraph>
                  </PdfView>
                  <PdfView style={pdfTw("flex flex-col flex-1")}>
                    <PdfResumeHeading>Server-Side/Scripting</PdfResumeHeading>
                    <PdfResumeParagraph>React</PdfResumeParagraph>
                    <PdfResumeParagraph>Electron</PdfResumeParagraph>
                    <PdfResumeParagraph>Stencil</PdfResumeParagraph>
                    <PdfResumeParagraph>Style Dictionary</PdfResumeParagraph>
                    <PdfResumeParagraph>Tailwind CSS</PdfResumeParagraph>
                  </PdfView>
                  <PdfView style={pdfTw("flex flex-col flex-1")}>
                    <PdfResumeHeading>DevOps/Repo. Management</PdfResumeHeading>
                    <PdfResumeParagraph>React</PdfResumeParagraph>
                    <PdfResumeParagraph>Electron</PdfResumeParagraph>
                    <PdfResumeParagraph>Stencil</PdfResumeParagraph>
                    <PdfResumeParagraph>Style Dictionary</PdfResumeParagraph>
                    <PdfResumeParagraph>Tailwind CSS</PdfResumeParagraph>
                  </PdfView>
                </PdfView>
              </PdfResumeSection>
            </PdfView>
          </PdfView>
        </PdfView>
        <PdfResumeFooter />
      </PdfPage>
    </PdfDocument>
  );
}

export default PdfResume;
