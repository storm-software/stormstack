"use client";

/* eslint-disable react/jsx-no-useless-fragment */
import { PdfDownloadLink } from "@stormstack/core-client-pdf";
import { BaseComponentProps } from "@stormstack/design-system-components";
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
