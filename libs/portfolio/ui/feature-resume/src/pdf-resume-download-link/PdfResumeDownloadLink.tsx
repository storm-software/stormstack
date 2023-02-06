"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Link } from "@open-system/design-system-components";
import PdfResumeDownload from "../pdf-resume-download/PdfResumeDownload";

/* eslint-disable-next-line */
export interface PdfResumeDownloadLinkProps {}

export function PdfResumeDownloadLink(props: PdfResumeDownloadLinkProps) {
  return (
    <PdfResumeDownload>
      <div className="group flex max-h-20 flex-col justify-center gap-2 text-center">
        <ArrowDownTrayIcon className="stroke-link-2 transition-colors group-hover:stroke-hover-link-2" />
        <Link className="group-hover:text-hover-link-2">Download Resume</Link>
      </div>
    </PdfResumeDownload>
  );
}

export default PdfResumeDownloadLink;
