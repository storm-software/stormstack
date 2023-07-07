import { usePDF } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { DocumentProps, UsePdfInstance } from "../types";

export const usePdf = (
  document: ReactElement<DocumentProps>
): [UsePdfInstance, (newDocument: ReactElement<DocumentProps>) => void] => {
  return usePDF({
    document,
  });
};
