"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Link } from "@open-system/design-system-components";
import { PdfDownloadLink } from "@open-system/shared-ui-feature-pdf";
import { useEffect, useState } from "react";
import { PdfResume } from "../pdf-resume";

/* eslint-disable-next-line */
export interface PdfResumeDownloadProps {}

export function PdfResumeDownload(props: PdfResumeDownloadProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PdfDownloadLink
          document={<PdfResume />}
          fileName="Patrick Sullivan - Resume.pdf">
          <div className="group flex max-h-20 flex-col justify-center gap-2 text-center">
            <ArrowDownTrayIcon className="stroke-link-2 transition-colors group-hover:stroke-hover-link-2" />
            <Link className="group-hover:text-hover-link-2">
              Download Resume
            </Link>
          </div>
        </PdfDownloadLink>
      )}
    </>
  );
}

export default PdfResumeDownload;
