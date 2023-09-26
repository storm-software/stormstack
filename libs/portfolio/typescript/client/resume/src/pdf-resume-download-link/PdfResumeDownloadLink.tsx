"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Link } from "@stormstack/design-system-components";
import PdfResumeDownload from "../pdf-resume-download/PdfResumeDownload";

/* eslint-disable-next-line */
export interface PdfResumeDownloadLinkProps {}

export function PdfResumeDownloadLink(props: PdfResumeDownloadLinkProps) {
  return (
    <PdfResumeDownload>
      <div className="max-h-20 gap-2 group flex flex-col justify-center text-center">
        <ArrowDownTrayIcon className="stroke-link-2 transition-colors group-hover:stroke-hover-link-2" />
        <Link className="group-hover:text-hover-link-2">Download Resume</Link>
      </div>
    </PdfResumeDownload>
  );
}

export default PdfResumeDownloadLink;
