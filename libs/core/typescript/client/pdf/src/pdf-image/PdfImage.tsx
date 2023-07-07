import { Image } from "@react-pdf/renderer";
import { ImageWithSourceProp, ImageWithSrcProp } from "../types";

export type PdfImageProps = ImageWithSrcProp | ImageWithSourceProp;

export function PdfImage({ cache = true, ...props }: PdfImageProps) {
  return <Image cache={cache} {...props} />;
}
