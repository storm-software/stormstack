"use client";

import { usePDF } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { UsePdfInstance } from "../types";

export function usePdf(
  pdfDocument: ReactElement
): [UsePdfInstance, () => void] {
  const [instance, updateInstance] = usePDF({ document: pdfDocument });

  return [instance, updateInstance];
}
