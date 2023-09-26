import { Svg } from "@react-pdf/renderer";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { PdfNodeProps } from "../types";

export type PdfSvgProps = BaseComponentProps &
  PdfNodeProps & {
    /**
     * Enables debug mode on page bounding box.
     * @see https://react-pdf.org/advanced#debugging
     */
    debug?: boolean;
    width?: string | number;
    height?: string | number;
    viewBox?: string;
    preserveAspectRatio?: string;
  };

export function PdfSvg(props: PdfSvgProps) {
  return <Svg {...props} />;
}
