import { ImageResponse } from "next/server";
import AppIcon from "../components/app-icon";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 16, height: 16 },
      id: "ios-16.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 20, height: 20 },
      id: "ios-20.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 29, height: 29 },
      id: "ios-29.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "ios-32.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 40, height: 40 },
      id: "ios-40.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 50, height: 50 },
      id: "ios-50.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 57, height: 57 },
      id: "ios-57.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 58, height: 58 },
      id: "ios-58.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 60, height: 60 },
      id: "ios-60.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 64, height: 64 },
      id: "ios-64.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 72, height: 72 },
      id: "ios-72.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 76, height: 76 },
      id: "ios-76.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 80, height: 80 },
      id: "ios-80.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 87, height: 87 },
      id: "ios-87.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 100, height: 100 },
      id: "ios-100.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 114, height: 114 },
      id: "ios-114.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 120, height: 120 },
      id: "ios-120.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 128, height: 128 },
      id: "ios-128.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 144, height: 144 },
      id: "ios-144.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 152, height: 152 },
      id: "ios-152.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 167, height: 167 },
      id: "ios-167.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 180, height: 180 },
      id: "ios-180.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 167, height: 167 },
      id: "ios-167.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 192, height: 192 },
      id: "ios-192.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 256, height: 256 },
      id: "ios-256.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 512, height: 512 },
      id: "ios-512.png",
      alt: "Pat Sullivan Development",
    },
    {
      contentType: "image/png",
      size: { width: 1024, height: 1024 },
      id: "ios-1024.png",
      alt: "Pat Sullivan Development",
    },
  ];
}

export default function AppleIcon({
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
        <AppIcon width={width} height={height} />
      </div>
    ),
    {
      height,
      width,
    }
  );
}
