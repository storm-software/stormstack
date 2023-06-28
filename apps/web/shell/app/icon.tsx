import Image from "next/image";
import { ImageResponse } from "next/server";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 16, height: 16 },
      id: "favicon-16x16.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "favicon-32x32.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 192, height: 192 },
      id: "android-chrome-192x192.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 512, height: 512 },
      id: "icon-512x512.png",
      alt: "Pat Sullivan Development",
    },
  ];
}

export default function Icon({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}>
        <Image
          src={`/${id}`}
          alt="Pat Sullivan Development"
          height={height}
          width={width}
        />
      </div>
    ),
    {
      height,
      width,
    }
  );
}
