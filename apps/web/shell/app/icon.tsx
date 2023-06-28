import { ImageResponse } from "next/server";
import AppIcon from "../components/app-icon";

export function generateImageMetadata() {
  return [
    {
      id: "favicon.ico",
      alt: "Pat Sullivan Development",
      contentType: "image/ico",
      size: { width: 12, height: 12 },
    },
    {
      id: "favicon-16x16.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 16, height: 16 },
    },
    {
      id: "favicon-32x32.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 32, height: 32 },
    },
    {
      id: "android-launchericon-192-192.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 192, height: 192 },
    },
    {
      id: "android-launchericon-144-144.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 144, height: 144 },
    },
    {
      id: "android-launchericon-96-96.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 96, height: 96 },
    },
    {
      id: "android-launchericon-72-72.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 72, height: 72 },
    },
    {
      id: "android-launchericon-48-48.png",
      alt: "Pat Sullivan Development",
      contentType: "image/png",
      size: { width: 48, height: 48 },
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
        <AppIcon width={width} height={height} />
      </div>
    ),
    {
      height,
      width,
    }
  );
}
