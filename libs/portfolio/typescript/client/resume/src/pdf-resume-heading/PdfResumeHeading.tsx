/* eslint-disable react/jsx-no-useless-fragment */
import { PdfText, pdfTw } from "@stormstack/core-client-pdf";
import { BaseComponentProps } from "@stormstack/design-system-components";
import clsx from "clsx";

export type PdfResumeHeadingProps = BaseComponentProps;

export function PdfResumeHeading({
  className,
  children,
  ...props
}: PdfResumeHeadingProps) {
  return (
    <>
      {children && (
        <PdfText
          style={pdfTw(
            clsx("text-sm font-anybody-bold pr-2 text-slate-600", className)
          )}>
          {children}
        </PdfText>
      )}
    </>
  );
}
