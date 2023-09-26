/* eslint-disable react/jsx-no-useless-fragment */
import { PdfText, pdfTw } from "@stormstack/core-client-pdf";
import { BaseComponentProps } from "@stormstack/design-system-components";
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
