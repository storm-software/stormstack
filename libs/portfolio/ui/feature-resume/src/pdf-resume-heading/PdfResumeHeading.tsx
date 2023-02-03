/* eslint-disable react/jsx-no-useless-fragment */
import { BaseComponentProps } from "@open-system/design-system-components";
import { PdfText, pdfTw } from "@open-system/shared-ui-feature-pdf";
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
