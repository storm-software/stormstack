/* eslint-disable react/jsx-no-useless-fragment */
import { BaseComponentProps } from "@open-system/design-system-components";
import { PdfText, pdfTw } from "@open-system/core-client-pdf";
import clsx from "clsx";

export type PdfResumeParagraphProps = BaseComponentProps;

export function PdfResumeParagraph({
  className,
  children,
  ...props
}: PdfResumeParagraphProps) {
  return (
    <>
      {children && (
        <PdfText
          style={pdfTw(
            clsx("flex text-sm font-inter text-slate-800", className)
          )}>
          {children}
        </PdfText>
      )}
    </>
  );
}
