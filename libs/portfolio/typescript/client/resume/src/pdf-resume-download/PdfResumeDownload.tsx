"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import { BaseComponentProps } from "@open-system/design-system-components";
import { PdfDownloadLink } from "@open-system/core-client-pdf";
import { useEffect, useState } from "react";
import { PdfResume } from "../pdf-resume";

export function PdfResumeDownload({ children, ...props }: BaseComponentProps) {
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
          {children}
        </PdfDownloadLink>
      )}
    </>
  );
}

export default PdfResumeDownload;
